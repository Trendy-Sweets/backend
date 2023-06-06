import clientClass from '../class/clientClass.js';
import OrderClass from '../class/orderClass.js';
import productClass from '../class/productClass.js';
import validFormClass from '../class/validFormClass.js';


import config from '../../config.json' assert { type: "json" };
import region_list from '../lib/region.json' assert { type: "json"};
import city_list  from '../lib/city.json' assert {type: "json"};
import orderClass from '../class/orderClass.js';

class OrderController {
   
    // формируем данные для формы оформления заказа
    async getAddFormInfo(req, res) {

        let result = {
            products:'',
            allCartPrice:0,
            error:false,
            msgError: '',
            client: {
                IsLogin: null,
                clientId: null,
                clientName: null
            },
            region: {
                region_code: [config.default_params.region],
                region_name: [region_list.DP],
            },
            city: {
                city_code: [config.default_params.city],
                city_name: [city_list.DP.DP],
            },
            
        };

        try {
            
            const temp = await validFormClass.validCookieCart(req.cookies.cart);
            if (temp.isOk)
            { // с кукой все ок
                // значит все ключи - цифры // уже ок - можно передавать на обработку
                const cartItems = await JSON.parse(req.cookies.cart);
                // получаем инфу о продуктах
                const id_list = Object.keys(cartItems);
                let product_info_rows = await productClass.getProductListByListId(id_list);

                if (!product_info_rows.error)
                {
                    let allCartPrice = 0;
                    const modifiedToReturn = product_info_rows.toReturn.map(item => {
                        const count = cartItems[item.productid];
                        allCartPrice += item.price * count;
                        return { ...item, count };
                    });
                    
                    result.products     = modifiedToReturn;
                    result.allCartPrice = allCartPrice;
                    result.error = false;
                    result.client = {
                        IsLogin: clientClass.IsLogin,
                        clientId: clientClass.userIdNow,
                        clientName: clientClass.userName
                    };

                }
                else
                {
                    result.error = true;
                    result.msgError = product_info_rows.msg;
                }
            }
            else
            {
                result.error = true;
                result.msgError = temp.msg;
            }
            res.json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
  // страница - оформление заказа / ПРИЕМ данных с формы
    async addNewOrder(req, res) {

        let result = {
            isCreateOrder: false, // флаг создания записи в БД о заказе
            msgError: '',
            validForm:{
                phone:{
                    isOk:false,
                    msg:''
                },
                region:{
                    isOk:false,
                    msg:''
                },
                city:{
                    isOk:false,
                    msg:''
                },
                addres:{
                    isOk:false,
                    msg:''
                },
                data:{
                    isOk:false,
                    msg:''
                },
                time:{
                    isOk:false,
                    msg:''
                },
            },
            pay_url:'', 
            pay_param: {},
        }

        try {
            // парсим куки cart
            // проверяем на доступность указанных idProduct ?????
            const temp = await validFormClass.validCookieCart(req.cookies.cart);
            if (temp.isOk)
            { // с кукой все ок
                
                // проверяем авторизацию
                if (clientClass.IsLogin)
                {
                    const clientId = clientClass.userIdNow;
                    const clientName = clientClass.userName;
                    // значит все ключи - цифры // уже ок - можно передавать на обработку и авторизация ок
                    const cartItems = await JSON.parse(req.cookies.cart);
                    //console.log(cartItems);
    
                    // максимальное время для приготовления изделия
                    const maxTime = await  productClass.getMaxTimeExecuteProduct(Object.keys(cartItems));
                    const allPrice = await productClass.getAllPrice(cartItems);
                    //console.log('allPrice = '+allPrice);
                    if (maxTime.error)
                    {
                        result.isCreateOrder = false;
                        result.msgError = 'Не змогли отримати максимальний час ни виготовлення замовлення';
                    }
                    else
                    {
                            // собираем/проверяем POST параметры
                            const {phone, region, city, addres, data, time} = req.body;

                            result.validForm.addres  = await validFormClass.checkAdress(addres);
                            result.validForm.phone  = await validFormClass.checkPhone(phone);
                            result.validForm.data   = await validFormClass.checkDate(data, maxTime.maxTime);
                            result.validForm.time   = await validFormClass.checkTime(time); 
                            result.validForm.region = await validFormClass.checkRegion(region);
                            result.validForm.city   = await validFormClass.checkCity(city, region);
                            
                            if (Object.values(result.validForm).every(field => field.isOk))
                            {
                                // све поля правильные
                                //console.log('User id  = '+clientId+' | User Name = '+ clientName);
                                // создаем запись в таблицах order_list / order_product
                                // ставим пометку что оплаты нет
                                const dataForm = {
                                    phone: phone,
                                    region: region,
                                    city: city,
                                    addres: addres,
                                    data: data,
                                    time: time
                                }
                                //console.log('Form - ' + dataForm);
                                //console.log('CartItems - '+ cartItems);
                                const idOrder = await orderClass.addNewOrder(clientId, allPrice, dataForm, cartItems);
                                if (!idOrder)
                                {
                                    result.isCreateOrder = false;
                                    result.msgError      = "Помилка при створенны замовлення";
                                }
                                else
                                {
                                    result.isCreateOrder = true;
                                }
                            }
                    }
                }
                else
                {
                    result.isCreateOrder = false;
                    result.msgError      = "Помилка авторизації клієнта";
                }
            }
            else
            {
                result.isCreateOrder = false;
                result.msgError      = temp.msg;
            }
            
            res.json(result);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err.message);
        }
    }
    // клиент оформляет заказ - заполняет данные по доставке, дате и прочее
    // принимаем вместе с перечнем продуктов в корзине и их количеством
    async postCartProcessingToOrder(req, res) {
        try {
            const {ProductIdList,ProductCountList,ClietnInfo} = req.params;
          
            res.json('оформляем заказ и сохрпаняем его в БД');

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // получение статуса заказа с номером 
    async getOrderStatus(req, res) {
        try {
            const {idOrder} = req.params;
          
            res.json('статус заказа с номером - '+idOrder);

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // отправляем ответ на запрос получения статуса оплаты для конкретного заказа
    async getBuyOrderStatus(req, res) {
        try {
            const {idOrder} = req.params;
          
            res.json('статус оплаты заказа номером - '+idOrder);

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
 
    //  добавление в куки-файл - ts_cart - еще одного товара
    async addProductIdToCart_Cookies(req, res) {
        try { 
            const {idOrder,StatusBuy} = req.params;
          
            res.json('Обновили статус оплаты заказа № ' + idOrder);

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}

export default new OrderController();