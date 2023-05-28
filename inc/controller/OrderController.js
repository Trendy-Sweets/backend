import OrderClass from '../class/OrderClass.js';

class OrderController {
   
    // загрузка данных о товарах в корзине
    async getCartProductInfo(req, res) {
        try {
// просмотр корзины товаров
// взять данные из куки - {id:count; id:count}
// возврат массив сведений о товаре согласно дизайну

// отдельно суммарная стоимость корзины 


// кфото превью товара главного группы и товарных вариаций


            //const {ProductIdList,ProductCountList} = req.params;
            console.log('I AM WORK');
            res.json('Данные о товарах в корзине');

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
}

export default new OrderController();