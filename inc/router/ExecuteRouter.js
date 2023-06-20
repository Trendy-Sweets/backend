import Router from 'express';
import WorkExecController from '../controller/executer/WorkExecController.js';


const routerExecute = new Router;

const rout = [
    // аторизация 
    { method: 'post',   path:'/login',                      handler: WorkExecController.postLogIn },
    { method: 'get',    path: '/logout',                    handler: WorkExecController.getLogout },
    { method: 'post',   path: '/register',                  handler: WorkExecController.postSignIn},
    // список товарных групп и продуктов в них - для прохождения обучения
    { method: 'get',    path: '/education/productlist',     handler: WorkExecController.getEducationProductList},
    // страница обучения конкретного продукта
    { method: 'get',    path: '/education/processing/:idProduct', handler: WorkExecController.getEducationProductInfo},
    // нажатие на кнопку "завершить обучение" для конкретного продукта
    { method: 'post',   path: '/education/complete',        handler:WorkExecController.postEducationProductComplete},
    // главная
    { method: 'get',  path: '/',                            handler: WorkExecController.getMainExecuterPage }, 
    //{ method: 'post',  path: '/login',                  handler: '' },
    //{ method: 'get', path: '/logout',                   handler: '' },
     ];
  

  rout.forEach((route) => {
    if (route.method === 'get') {
        routerExecute.get(route.path, route.handler);
    } 
    else if (route.method === 'post') {
        routerExecute.post(route.path, route.handler);
    } 
    else {
        routerExecute.use((req, res, next) => {
        res.status(404).send('Not Found');
      });
    }
  });
  
export default routerExecute; 