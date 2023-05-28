import clientClass from '../class/clientClass.js';
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
            return true;
          }
        } catch (error) {
          console.error(error);
          return 'Error in clientClass';
        }
      }

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
     // регистрация
    async postSignIn(req, res) {
        try {
            const {Login,Password,Email,FirstName,LastName, Phone} = req.params;
          
            // result = { namePole : "string otvet"}
            res.json('Регистрация пользователя');


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}


export default new ClientController();