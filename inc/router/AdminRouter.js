import Router from 'express';
import UserController from '../controller/admin/UserController.js';
import WorkController from '../controller/admin/WorkController.js';
import executerClass from '../class/admin/executerClass.js';


const routerAdmin = new Router;

// /api/admin  ++++++++ 

const rout = [
    // главная
   // { method: 'get',  path: '/',                        handler: '' }, 
   // авторизация
    { method: 'post',   path: '/login',                     handler: UserController.postLogIn },
    { method: 'get',    path: '/logout',                    handler: UserController.getLogout },
    // главная
    { method: 'get',    path: '/',                          handler: WorkController.getMainAdminPage },
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