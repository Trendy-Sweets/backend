import Router from 'express';
import ProductController from '../controller/client/ProductController.js';
import ClientController from '../controller/client/ClientController.js';
import OrderController from '../controller/client/OrderController.js';

const router = new Router;

const rout = [
    // главная
    { method: 'get',  path: '/',                        handler: ProductController.getMainPage }, 
    // страница вариациипродукта
    { method: 'get',  path: '/sweet/:idProduct',        handler: ProductController.getProductInfoById }, 
    // страница регистрации - отпарвка формы
    { method: 'post', path: '/register',                handler: ClientController.postSignIn },
    // страница авторизации - отправка к нам формы с логином и паролем
    { method: 'post',  path: '/login',                  handler: ClientController.postLogIn },
    // выход - удаление авторизации (куки)
    { method: 'get', path: '/logout',                   handler: ClientController.getLogout },
    // страница - корзина  ---- получаем куку с перечнем продуктов и выдаем по ним инфу
    { method: 'get', path: '/cart',                     handler: ProductController.getProductInCart},
    // страница оформления заказа  --- дакем данные по текущей корзине и статусу атворизации клиента
    { method: 'get', path: '/cart/addOrderForm',        handler: OrderController.getAddFormInfo},
    // рпием данных с формы оформления заказа
    { method: 'post', path: '/order/add',               handler: OrderController.addNewOrder},
    // списко заказов со статусами
    { method: 'get', path: '/order/list',               handler: OrderController.getOrderListByClient},

    //  оформление заказа - передают POST массив с данными о заказе и куку с перечнем продуктов в корзине
    //{ method: 'post', path: '/'}

    //{ method: 'get',  path: '/order',                 handler: OrderController.getCartProductInfo },  //ПОказ содержтимого корзині ...отдаем инфу из БД о продукции в корзине/ Данные что в корзине получаем по гет-запросу в виде набора Айди и количества
    //{ method: 'get',  path: '/order/status/:idOrder', handler: OrderController.getOrderStatus },  //инвормация о статусе заказа и продуктов в нем
    //{ method: 'post',  path: '/order/buy/:idOrder',   handler: OrderController.putBuyOrderStatus },  // сохранение данных о результатах оплаты заказа
    //{ method: 'get',  path: '/order/buy/:idOrder',    handler: OrderController.getBuyOrderStatus },  // получение данных о результатах оплаты заказа
    //{ method: 'post', path: '/order/processing',      handler: OrderController.postCartProcessingToOrder },  // получаем данные дл оформление заказа (датиа доставки, адресс ...) и записываем ее в БД
    //{ method: 'post', path: '/order/processing/addToCart/:idProduct', handler: OrderController.addProductIdToCart_Cookies}, // добавление в корзину товара с его айди .. количество по умолчанию 1 шт
    //{ method: 'post', path: '/order/processing/changeCountInCart/:idProduct?:plus/minus', handler: OrderController.addProductIdToCart_Cookies}, 
  ];
  //{ method: 'put',  path: '/login/put',      handler: ClientController.putLogin },  // обновление данных о клиенте (подверждение почты например)
  

  rout.forEach((route) => {
    if (route.method === 'get') {
      router.get(route.path, route.handler);
    } 
    else if (route.method === 'post') {
      router.post(route.path, route.handler);
    } 
    else {
      // Если метод маршрута неизвестен, выдаем 404 ошибку
      router.use((req, res, next) => {
        res.status(404).send('Not Found');
      });
    }
  });
  
export default router; 