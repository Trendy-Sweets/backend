import clientClass from '../class/clientClass.js';

class ClientController {
   
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
          
            res.json('Регистрация пользователя');


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}


export default new ClientController();