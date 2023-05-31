import { connDB } from '../../index.js';
import bcrypt from 'bcrypt';

class clientClass {
  
  constructor() {
    this.IsLogin = false;   // если True - значит авторизован
    this.userIdNow = null; // тут будет id usera если он авторизован
    this.userName = ""; // имя авторизованного клиента
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
              console.log('Новая запись успешно добавлена');
              return true;
            } else {
              console.log('Не удалось добавить новую запись');
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
              console.log(client_arr.password, result.rows[0].password);
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
          console.log('Пароли совпадают');
          return true;
        } else {
          console.log('Пароли не совпадают');
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }
}
  
  export default new clientClass();