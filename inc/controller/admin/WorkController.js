import validFormClass from '../../class/global/validFormClass.js';
import userAdminClass from '../../class/admin/userAdminClass.js';
import executerClass from '../../class/admin/executerClass.js';
import { parse } from 'cookie';
import productAdminClass from '../../class/admin/productAdminClass.js';

class WorkController {
   
    async getMainAdminPage(req, res)
    {
        const status_login = await userAdminClass.checkAuthorization(req.cookies);

        let result = {
            error: false,
            errorMSG: '',
            okLogin: {
                isLogin: status_login.IsLogin,
                userIdNow: status_login.userIdNow,
                userName: status_login.userName,
                userPosition: status_login.userPosition
            },
            executerWhait:0,
            executerAllowed:0,
            executerReady:0,
            orderRun:15, /// не забыть добавить метод выборки
        }

        try
        {
            //console.log(result);
            if (status_login.IsLogin)
            {
                // кол.исполнителей которіе жду апрува
                // executer.allowed = 0
                console.log('count whait allowed - ');
                const countWhait = await executerClass.getExecutersListWhait();
                // всего апрувленных исполнителей executer.allowed = 1
                const countAllowed = await executerClass.getExecutersListAllowed();
                // всего исполнителей которые готовы принимать заказа executer.allowed = 1 and executer.ready = 1
                const countReady = await executerClass.getExecutersListReady();

                result.executerWhait = countWhait;
                result.executerAllowed = countAllowed;
                result.executerReady = countReady;

                // всего заказов в работе
                // всего выполнено заказов
                result.error = false;
            }
            else
            {
                result.error = true;
                result.errorMSG = 'Ми маєте бути авторизованим';
            }
            res.json(result);
        }
        catch(err)
        {
            result.error = true;
            result.errorMSG = err.message;
            res.status(500).json(result);
        }

    }

    async getLogout(req, res) {
        try {
            // для выхода - тупо удаляем куку
            res.clearCookie('ts_admin');
            res.json("ok");
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async test(req, res) {
        try {
            // для выхода - тупо удаляем куку
            const result = await executerClass.testsql();
            res.json(result);
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // управление товарами - список групп и товаров
    async getProductGroupList(req, res) 
    {
        const status_login = await userAdminClass.checkAuthorization(req.cookies);

        let result = {
            error: false,
            errorMSG: '',
            okLogin: {
                isLogin: status_login.IsLogin,
                userIdNow: status_login.userIdNow,
                userName: status_login.userName,
                userPosition: status_login.userPosition
            },
            products:{}
        }

        try {
            if (status_login.IsLogin)
            {
                // надо получить обьект состощий из списка групп 
                // а каждая такая группа включает обьект из списка продуктов этой группы
                const temp = await productAdminClass.getProductGroup_list();

                if (temp.error)
                {
                    result.error = true;
                    result.errorMSG = temp.msg;
                }
                else
                {
                    result.error = false;
                    result.products = temp.toReturn;
                }
            }
            else
            {і
                result.error = true;
                result.errorMSG = 'Ви маєте бути авторизованим';
            }
            res.json(result);
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

}


export default new WorkController();