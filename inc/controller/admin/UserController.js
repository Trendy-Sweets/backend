import validFormClass from '../../class/global/validFormClass.js';
import userAdminClass from '../../class/admin/userAdminClass.js';

class ClientController {
   
    async checkAuthorization(cookies) { // проверяем авторизацию по куки ts_admin
        try {
          if (!cookies.ts_login) {
            userAdminClass.IsLogin = false;
            userAdminClass.userIdNow = null;
            userAdminClass.userName = null;
            userAdminClass.userPosition = null;
            return false;
          }
          // ts_login={"id": 2}; Path=/;
          const cookieValue = await JSON.parse(cookies.ts_login);
          
          if (cookieValue.id === false) {
            userAdminClass.IsLogin = false;
            userAdminClass.userIdNow = null;
            userAdminClass.userName = null;
            userAdminClass.userPosition = null;
            return false;
          }
    
          if (typeof cookieValue.id === 'number') {
            userAdminClass.IsLogin = true;
            userAdminClass.userIdNow = cookieValue.id;
            userAdminClass.userName = cookieValue.name;
            userAdminClass.userPosition = cookieValue.position;
            return true;
          }
        } catch (error) {
          console.error(error);
          return 'Error in clientClass';
        }
      }
    // nсраница авторизации !!!
    async postLogIn(req, res) {
        var result = {
            'email':{},
            'password':{},
            'okLogin': {
                isOk: false,
                id: 0,
                name: '',
                position: '',
                msg: ''
            },
            'okForm': false
        };

        try {
            const {email,password} = req.body;
            result['email'] = await validFormClass.checkEmail(email);
            let countEmail  = await userAdminClass.checkEmailInDB(email);

            if (!countEmail)
            {
                result['email'].isOk = false;
                result['email'].msg  = "Проблема при пошуку пошти в базі даних";
            }
            else
            {
                if (countEmail != 1)
                {
                    result['email'].isOk = false;
                    result['email'].msg  = "Email не знайдено в базі даних";
                }
            }

            result['password'] = await validFormClass.checkPassword(password);

            if (result['email'].isOk & result['password'].isOk)
                result['okForm'] = true; 
            
            if (result['okForm'])
            {
                const paramAdd = {'email': email, 'password': password};
                result['okLogin'] = await userAdminClass.loginClient(paramAdd);

                // если успешно - ставим куку что мы авторизованы
                const cookieData = { id: result['okLogin'].id, name: result['okLogin'].name, position: result['okLogin'].position };
                const oneMonth = 30 * 24 * 60 * 60 * 1000; 
                const cookieOptions = {
                  maxAge: oneMonth,
                  httpOnly: true
                };

                // Устанавливаем куки-файл в заголовке ответа
                res.cookie('ts_admin', JSON.stringify(cookieData), cookieOptions);
            }
            else {
               // result['okLogin'].isOk = false;
               // result['okLogin'].msg = 'Помилка даних в форміі';
            }
            
            res.json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
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
}


export default new ClientController();