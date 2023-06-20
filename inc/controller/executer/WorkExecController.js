import userExecuterClass from "../../class/executer/userExecuterClass.js";
import userProductClass from "../../class/executer/userProductClass.js";
import validFormClass from "../../class/global/validFormClass.js";
import config from '../../../config.json' assert { type: "json" };

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

    // регистрация
    async postSignIn(req, res) {
        try {
            const { email, phone, fio, password, repassword, addres, anketa_oldwork, anketa_stag, anketa_medkarta, anketa_year, anketa_child } = req.body;
            let countEmail;
            var result = {
                fio:{},
                email:{},
                password:{},
                repassword:{},
                comparePassword:{},
                addres:{},
                anketa_oldwork:{},
                anketa_stag:{},
                anketa_medkarta:{},
                anketa_year:{},
                anketa_child:{}
                
            };
            

            // проверка поля имя - пустое / не пустое, разрешены только буквы
            result['fio'] = await validFormClass.checkName(fio);
            result['addres'] = await validFormClass.checkAdress(addres);
            result['phone'] = await validFormClass.checkPhone(phone);
            result['anketa_oldwork'] = await validFormClass.checkText(anketa_oldwork);
            result['anketa_stag'] = await validFormClass.checkText(anketa_stag);
            result['anketa_medkarta'] = await validFormClass.checkOneOrZero(anketa_medkarta);
            result['anketa_year'] = await validFormClass.checkYear(anketa_year);
            result['anketa_child'] = await validFormClass.checkOneOrZero(anketa_child);
            

            // проерка поля почта - пустое или нет/ валадация адреса / проверка наличия в базе такой почты
            result['email'] = await validFormClass.checkEmail(email);
            countEmail = await userExecuterClass.checkEmailInDB(email);
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
                //const paramAdd = {'fio': fio, 'email': email, 'password': password};
                //console.log(paramAdd.name);
                if (userExecuterClass.addClientToDB(req.body))
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
            res.clearCookie('ts_executer');
            res.json("ok");
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // Список товаров для прохождения обучения
    async getEducationProductList(req, res)
    {
        let result = {
            error: false,
            errorMSG: '',
            okLogin: {
                isLogin: false,
                userIdNow: null,
                userName: null
            },
            countNotEducation: 0,
            products: []
        };

        try {
            // сначала надо проверить авторизацию
            const status_login = await userExecuterClass.checkAuthorization(req.cookies); 

            if (status_login.IsLogin)
            {
                result.okLogin.isLogin   = true;
                result.okLogin.userIdNow = status_login.userIdNow;
                result.okLogin.userName  = status_login.userName;

                const temp = await userProductClass.getEducationProductList(result.okLogin.userIdNow);

                if (temp.error)
                {
                    result.error = true;
                    result.errorMSG = temp.errorMSG;
                }
                else
                {
                    result.products = temp.toReturn;
                    result.countNotEducation =  temp.countNotEducation;
                    result.error = false;
                }

            }
            else
            {
                result.error = true;
                result.errorMSG = 'Відсутня авторизація. Спершу ввійдіть на сайт під своїм логіном та паролем';
            }

            res.json(result);
        }  catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    // страница обучения конкретного продукта
    async getEducationProductInfo(req, res)
    {   
        let result = {
            error: false,
            errorMSG: '',
            okLogin: {
                isLogin: false,
                userIdNow: null,
                userName: null
            },
            productId:0,
            productFoto: '',
            productComposition:'',
            productformula:''
        };

        try
        {
            const {idProduct} = req.params;
            const status_login = await userExecuterClass.checkAuthorization(req.cookies);

            if (status_login.IsLogin)
            {
                result.okLogin.isLogin   = true;
                result.okLogin.userIdNow = status_login.userIdNow;
                result.okLogin.userName  = status_login.userName;

                const temp = await userProductClass.getEducationProductInfo(Number(idProduct));

                if (temp.error)
                {
                    result.error = true;
                    result.errorMSG = temp.errorMSG;
                }
                else
                {
                   result.error = false;
                   result.productComposition = temp.toReturn.composition;
                   result.productformula     = temp.toReturn.formula;
                   result.productId          = Number(idProduct);
                   result.productFoto        = config.imgProdURL + temp.toReturn.foto;
                }

            }
            else
            {
                result.error = true;
                result.errorMSG = 'Відсутня авторизація. Спершу ввійдіть на сайт під своїм логіном та паролем';
            }

            res.json(result);
        }
        catch(error)
        {
            res.status(500).json(error.message);
        }
    }

    // прошел обучение по определенному продукту
    async postEducationProductComplete(req, res)
    {   
        let result = {
            error: false,
            errorMSG: '',
            resultMSG: '',
            okLogin: {
                isLogin: false,
                userIdNow: null,
                userName: null
            }
        };

        try
        {
            const {idProduct} = req.body;
            const status_login = await userExecuterClass.checkAuthorization(req.cookies);

            if (status_login.IsLogin)
            {
                result.okLogin.isLogin   = true;
                result.okLogin.userIdNow = status_login.userIdNow;
                result.okLogin.userName  = status_login.userName;

                const temp = await userProductClass.addEducationProductComplete(Number(idProduct), result.okLogin.userIdNow);

                if (temp.error)
                {
                    result.error = true;
                    result.errorMSG = temp.errorMSG;
                }
                else
                {
                    result.error = false;
                    result.resultMSG = temp.toReturn;
                }

            }
            else
            {
                result.error = true;
                result.errorMSG = 'Відсутня авторизація. Спершу ввійдіть на сайт під своїм логіном та паролем';
            }

            res.json(result);
        }
        catch(error)
        {
            res.status(500).json(error.message);
        }
    }
}


export default new WorkExecController();