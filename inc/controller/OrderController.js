import OrderClass from '../class/orderClass.js';

class OrderController {
   
  
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

    // получаем новый статус оплаты заказа - сохраняем его в БД
    async putBuyOrderStatus(req, res) {
        try {
            const {idOrder,StatusBuy} = req.params;
          
            res.json('Обновили статус оплаты заказа № ' + idOrder);

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