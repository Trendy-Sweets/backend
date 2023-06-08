import Router from 'express';


const routerExecute = new Router;

// Проверка авторизации один раз в главном роутере
routerExecute.use((req, res, next) => {
  const cookies = req.cookies;
  ClientController.checkAuthorization(cookies); // Проверка авторизации 
  
  next(); // Переход к следующему маршруту
});



const rout = [
    // главная
    //{ method: 'get',  path: '/',                        handler: '' }, 
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