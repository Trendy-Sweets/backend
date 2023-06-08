import Router from 'express';
import UserController from '../controller/admin/UserController.js';


const routerAdmin = new Router;

// Проверка авторизации один раз в главном роутере
routerAdmin.use((req, res, next) => {
  const cookies = req.cookies;
  UserController.checkAuthorization(cookies); // Проверка авторизации 
  
  next(); // Переход к следующему маршруту
});

// /api/admin  ++++++++ 

const rout = [
    // главная
   // { method: 'get',  path: '/',                        handler: '' }, 
    { method: 'post',  path: '/login',                  handler: UserController.postLogIn },
    { method: 'get', path: '/logout',                   handler: UserController.getLogout },
     ];
  

  rout.forEach((route) => {
    if (route.method === 'get') {
        routerAdmin.get(route.path, route.handler);
    } 
    else if (route.method === 'post') {
        routerAdmin.post(route.path, route.handler);
    } 
    else {
        routerAdmin.use((req, res, next) => {
        res.status(404).send('Not Found');
      });
    }
  });
  
export default routerAdmin; 