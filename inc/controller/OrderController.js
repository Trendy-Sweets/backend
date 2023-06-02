import clientClass from '../class/clientClass.js';
import OrderClass from '../class/orderClass.js';
import productClass from '../class/productClass.js';

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
        };

        try {
            // парсим куку с содержимым корзины
            // получем данные о товарах
            if (req.cookies.cart)
            {
                const cartItems = await JSON.parse(req.cookies.cart);
                // получаем инфу о продуктах
                const id_list = Object.keys(cartItems);
                if (id_list.length === 0) {
                    result.error = true;
                    result.msgError = 'Кошик порожній. Додайте необхідні солодощі спочатку.';
                }
                else {
                    let flag_id = true;
                    for (let i = 0; i < id_list.length; i++) {
                        const idProduct = id_list[i];
                        if (isNaN(Number(idProduct))) {
                            flag_id = false;
                        }
                    } 
                    // проверяем что мы там получили с ключами
                    if (flag_id)
                    {
                        // значит все ключи - цифры // уже ок - можно передавать на обработку
                         
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
                        result.msgError = 'Помилка в кукі файлі. Невірні дані для обробки';
                    }
                }
            }
            else
            {
                result.error = true;
                result.msgError = 'Відсутній файл cookie cart';
            }

            res.json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
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