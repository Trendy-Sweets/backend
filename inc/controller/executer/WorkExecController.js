import userExecuterClass from "../../class/executer/userExecuterClass.js";
import validFormClass from "../../class/global/validFormClass.js";

class WorkExecController {
   
    // аторизация
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
            let countEmail  = await userExecuterClass.checkEmailInDB(email);

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

                result['okLogin'] = await userExecuterClass.loginExecuter(paramAdd);

                // если успешно - ставим куку что мы авторизованы
                const cookieData = { id: result['okLogin'].id, name: result['okLogin'].fio };
                const oneMonth = 30 * 24 * 60 * 60 * 1000; 
                const cookieOptions = {
                  maxAge: oneMonth,
                  httpOnly: true
                };

                // Устанавливаем куки-файл в заголовке ответа
                res.cookie('ts_executer', JSON.stringify(cookieData), cookieOptions);
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
            res.clearCookie('ts_executer');
            res.json("ok");
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}


export default new WorkExecController();