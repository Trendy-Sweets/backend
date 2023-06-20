import { connDB } from '../../../index.js';
import bcrypt from 'bcrypt';

class clientClass {
  
  constructor() {
      //this.IsLogin = false;   // если True - значит авторизован
    // this.userIdNow = null; // тут будет id usera если он авторизован
    // this.userName = ""; // имя авторизованного клиента
  }

    async checkEmailInDB(email) {
      // проверка почты на наличие в базе данных
      try {
        const query = {
          text: 'SELECT COUNT(email) as countemail FROM client WHERE email = $1',
          values: [email],
          rowMode: 'object'
        }

        const result = await connDB.query(query);
        const countEmail = result.rows[0].countemail;       

        if (countEmail == 0 ) return countEmail;
        else return countEmail;
        
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    // добавление клиента в базу данных
    async addClientToDB(client_arr) {
      try {

            // Генерация хэша пароля
            const saltRounds = 10; // Количество раундов соли
            const hashedPassword = await bcrypt.hash(client_arr.password, saltRounds);
            //console.log(client_arr);
            // Запрос на добавление записи в таблицу
            const query = {
              text: 'INSERT INTO client (name, email, password, confirm) VALUES ($1, $2, $3, 1)',
              values: [client_arr.name, client_arr.email, hashedPassword]
            };

            const result = await connDB.query(query);

            if (result.rowCount > 0) {
              //console.log('Новая запись успешно добавлена');
              return true;
            } else {
              //console.log('Не удалось добавить новую запись');
              return false;
            }

      }
      catch(error) 
      {
        console.log(error);
        return false;
      }
    }

    // авторизация - принимаем логин и прароль
    async loginClient(client_arr) {
      try {
          // достаем из БД данные по указанной почте
          const query = {
            text: 'SELECT * FROM client WHERE email = $1',
            values: [client_arr.email]
          };

          const result = await connDB.query(query);

          if (result.rowCount == 0)
          {
            return {'isOk':false, 'msg':'Почта не знайдена'};
          }
          else
          {
              // сравниваем пароли 
              //console.log(client_arr.password, result.rows[0].password);
              const compareP =  await this.comparePasswords(client_arr.password, result.rows[0].password);


              if (!compareP)
              {
                return {'isOk':false, 'msg':'не вірний пароль'};
              }
              else
              {
                
                return {isOk:true, msg:'Вдалий вхід', id:result.rows[0].clientid, name:result.rows[0].name}; // тут надо передать айди и имя клиента
              }
          }
          
      } catch (error) {
        console.error(error);
        return 'Error in clientClass';
      }
    }

   async comparePasswords(plainPassword, hashedPassword) {
      try {
        // Сравнение введенного пароля с сохраненным хэшем
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        
        if (isMatch) {
          //console.log('Пароли совпадают');
          return true;
        } else {
          //console.log('Пароли не совпадают');
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    async checkAuthorization(cookies) 
    { // проверяем авторизацию по куки ts_login   // ts_login={"id": 2}; Path=/;
      let result = {};
      try {
        if (!cookies.ts_login) {
          result.IsLogin = false;
          result.userIdNow = null;
          result.userName = null;
          
        }
        else
        {
          const cookieValue = await JSON.parse(cookies.ts_login);
            
          if (cookieValue.id === false) {
            result.IsLogin = false;
            result.userIdNow = null;
            result.userName = null;
            
          }
    
          if (typeof cookieValue.id === 'number') {
            result.IsLogin = true;
            result.userIdNow = cookieValue.id;
            result.userName = cookieValue.name;
            
          }
        }
       
        return result;
        
      } catch (error) {
        console.error(error);
        return 'Error in clientClass';
      }
    }

    // обратная связь - сохраняем в базу сообщение
    async saveMessageFromUser(msg_arr) 
    {
      
      try {
        const query = {
          text: 'INSERT INTO client_message '+
                '(fio,          phone,           email,         message,        rules)'+
                'VALUES ($1,      $2,             $3,             $4,              $5);',
          values: [msg_arr.fio, msg_arr.phone, msg_arr.email, msg_arr.message, msg_arr.rules],
          rowMode: 'object'
        }

        const result = await connDB.query(query);
        if (result.rowCount > 0) {
          //console.log('Новая запись успешно добавлена');
          return true;
        } else {
          //console.log('Не удалось добавить новую запись');
          return false;
        }     
        
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    // загрузка данных о клиенте с БД
    async getClienbtInfo(idClient)
    {
      let result = {
        error: false,
        errorMSG: '',
        toReturn: {}
      }
      try
      {
        const sql_select = {
          text: 'SELECT * FROM client WHERE clientid = $1',
          values: [idClient]
        };

        const temp = await connDB.query(sql_select);

        if (temp.rowCount > 0)
        {
            result.error = false;
            const row = temp.rows[0];

            const {
              email,
              confirm,
              date_register,
              name,
              date_lastvisit
            } = row;

            result.toReturn = {
              email: email,
              name: name
            }

        }
        else
        {
          result.error = true;
          result.errorMSG = 'клієнта не знайдено в БД або інша проблема';
        }

        return result;
      }
      catch(err)
      {
        result.error = true;
        result.errorMSG = err;
        return result;
      }

    }
}
  
  export default new clientClass();