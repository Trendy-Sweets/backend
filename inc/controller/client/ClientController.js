import clientClass from '../../class/client/clientClass.js';
import validFormClass from '../../class/global/validFormClass.js';
import { parse } from 'cookie';

class ClientController {
   
    // nсраница авторизации !!!
    async postLogIn(req, res) {
        var result = {
            'email':{},
            'password':{},
            'okLogin': {
                isOk: false,
                id: 0,
                name: '',
                msg: ''
            },
            'okForm': false
        };

        try {
            const {email,password} = req.body;
            result['email'] = await validFormClass.checkEmail(email);
            let countEmail  = await clientClass.checkEmailInDB(email);

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
                result['okLogin'] = await clientClass.loginClient(paramAdd);

                // если успешно - ставим куку что мы авторизованы
                const cookieData = { id: result['okLogin'].id, name: result['okLogin'].name };
                const oneMonth = 30 * 24 * 60 * 60 * 1000; 
                const cookieOptions = {
                  maxAge: oneMonth,
                  httpOnly: true
                };

                // Устанавливаем куки-файл в заголовке ответа
                res.cookie('ts_login', JSON.stringify(cookieData), cookieOptions);
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

     // регистрация клиента - получаем данные в пост-массиве
    async postSignIn(req, res) {
        try {
            const { email, password, repassword, name } = req.body;
            let countEmail;
            var result = {
                'name':{},
                'email':{},
                'password':{},
                'repassword':{},
                'comparePassword':{},
                
            };
            

            // проверка поля имя - пустое / не пустое, разрешены только буквы
            result['name'] = await validFormClass.checkName(name);

            // проерка поля почта - пустое или нет/ валадация адреса / проверка наличия в базе такой почты
            result['email'] = await validFormClass.checkEmail(email);
            countEmail = await clientClass.checkEmailInDB(email);
            if (!countEmail)
            {
                result['email'].isOk = false;
                result['email'].msg  = "Невідома помилка з базою даних";
            }
            else
            {
                if (countEmail != 0)
                {
                    result['email'].isOk = false;
                    result['email'].msg  = "Цей Email вже є в базі даних";
                }
            }

            // проверка на одинаковость пароля и повтор пароля / проверяем не пустые ли поля
            result['password'] = await validFormClass.checkPassword(password);
            result['repassword'] = await validFormClass.checkPassword(repassword);
            result['comparePassword'] = await validFormClass.comparePassword(password, repassword);
          
            result['okForm'] = Object.values(result).every(field => field.isOk);
          
            // добавляем клиента в базу данных
            if (result['okForm']){
                const paramAdd = {'name': name, 'email': email, 'password': password};
                //console.log(paramAdd.name);
                if (clientClass.addClientToDB(paramAdd))
                {
                    result['okAddToDB'] = true;
                }
                else
                {
                    result['okAddToDB'] = false;
                }

                // если успешно - ставим куку что мы авторизованы
                // - не ставим, он идет на авторизацию и там уже ставим
            }
            else {
                result['okAddToDB'] = false;
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
            res.clearCookie('ts_login');
            res.json("ok");
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}


export default new ClientController();