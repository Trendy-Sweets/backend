import clientClass from '../class/clientClass.js';
import OrderClass from '../class/orderClass.js';
import productClass from '../class/productClass.js';
import validFormClass from '../class/validFormClass.js';


import config from '../../config.json' assert { type: "json" };
import region from '../lib/region.json' assert { type: "json"};
import city   from '../lib/city.json' assert {type: "json"};

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
                region_name: [region.DP],
            },
            city: {
                city_code: [config.default_params.city],
                city_name: [city.DP],
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
            pay_url:'', 
            pay_param: {},
        }

        try {
            // парсим куки cart
            // проверяем на доступность указанных idProduct ?????
            const temp = await validFormClass.validCookieCart(req.cookies.cart);
            if (temp.isOk)
            { // с кукой все ок
                // значит все ключи - цифры // уже ок - можно передавать на обработку
                const cartItems = await JSON.parse(req.cookies.cart);
                console.log(cartItems);

                // создаем запись в таблицах order_list / order_product
                // ставим пометку что оплаты нет
                
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