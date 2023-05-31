import clientClass from '../class/clientClass.js';
import validFormClass from '../class/validFormClass.js';
import { parse } from 'cookie';

class ClientController {
   
    async checkAuthorization(cookies) { // проверяем авторизацию по куки ts_login
        try {
          if (!cookies.ts_login) {
            clientClass.IsLogin = false;
            clientClass.userIdNow = null;
            return false;
          }
          // ts_login={"id": 2}; Path=/;
          const cookieValue = JSON.parse(cookies.ts_login);
          
          if (cookieValue.id === false) {
            clientClass.IsLogin = false;
            clientClass.userIdNow = null;
            return false;
          }
    
          if (typeof cookieValue.id === 'number') {
            clientClass.IsLogin = true;
            clientClass.userIdNow = cookieValue.id;
            clientClass.userName = cookieValue.Name;
            return true;
          }
        } catch (error) {
          console.error(error);
          return 'Error in clientClass';
        }
      }
    // nсраница авторизации !!!
    async postLogIn(req, res) {
        try {
            const {Login,Password} = req.params;
          
            res.json('авторизация логина');


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async getLogin(req, res) {
        try {
            const {idClient} = req.params;
            res.json('Get Info for Client with ID - '+idClient);


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    // update CLient INFO
    async putLogin(req, res) {
        try {
            const {idClient, clientInfo} = req.params;
            res.json('Update Info for Client with ID - '+idClient);


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
     // регистрация клиента - получаем данные в пост-массиве
    async postSignIn(req, res) {
        try {
            const { email, password, repassword, name } = req.body;
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
            if (!await clientClass.checkEmailInDB(email))
            {
                result['email'].isOk = false;
                result['email'].msg  = "Ця почта вже зареєстрована";
            }

            // проверка на одинаковость пароля и повтор пароля / проверяем не пустые ли поля
            result['password'] = await validFormClass.checkPassword(password);
            result['repassword'] = await validFormClass.checkPassword(repassword);
            result['comparePassword'] = await validFormClass.comparePassword(password, repassword);
          
            result['okForm'] = Object.values(result).every(field => field.isOk);
          
            // добавляем клиента в базу данных
            if (result['okForm']){
                const paramAdd = {'name': name, 'email': email, 'password': password};
                console.log(paramAdd.name);
                result['okAddToDB'] = clientClass.addClientToDB(paramAdd);

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
}


export default new ClientController();