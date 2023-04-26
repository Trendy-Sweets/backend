import Router from 'express';
import ProductController from '../controller/ProductController.js';
import ClientController from '../controller/ClientController.js';
import OrderController from '../controller/OrderController.js';

const router = new Router;


const rout = [
    { method: 'get', path: '/', handler: ProductController.getMainPage }, // главная
    { method: 'get', path: '/sweet/:idGroup', handler: ProductController.getProdctGroupInfo }, // страница вариациипродукта
    { method: 'post', path: '/register', handler: ClientController.postSignIn }, // регистрация клиента
    { method: 'get', path: '/login', handler: ClientController.getLogin },   // загрузка данных о клиенте по его номеру
    { method: 'post', path: '/login', handler: ClientController.postLogIn },  // авторизация клиента
    { method: 'put', path: '/login', handler: ClientController.putLogin },  // обновление данных о клиенте (подверждение почты например)
    { method: 'get', path: '/order/status/:idOrder', handler: OrderController.getOrderStatus },  //инвормация о статусе заказа и продуктов в нем
    { method: 'put', path: '/order/buy/:idOrder', handler: OrderController.putBuyOrderStatus },  // сохранение данных о результатах оплаты заказа
    { method: 'get', path: '/order/buy/:idOrder', handler: OrderController.getBuyOrderStatus },  // получение данных о результатах оплаты заказа
    { method: 'post', path: '/order/processing', handler: OrderController.postCartProcessingToOrder },  // получаем данные дл оформление заказа (датиа доставки, адресс ...) и записываем ее в БД
    { method: 'get', path: '/cart', handler: OrderController.getCartProductInfo }  //отдаем инфу из БД о продукции в корзине/ Данные что в корзине получаем по гет-запросу в виде набора Айди и количества
    
  ];
  
  rout.forEach((route) => {
    if (route.method === 'get') {
      router.get(route.path, route.handler);
    } else if (route.method === 'post') {
      router.post(route.path, route.handler);
    } else {
      // Если метод маршрута неизвестен, выдаем 404 ошибку
      router.use((req, res, next) => {
        res.status(404).send('Not Found');
      });
    }
  });
  
export default router; 