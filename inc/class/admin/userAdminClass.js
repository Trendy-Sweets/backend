import { connDB } from '../../../index.js';
import bcrypt from 'bcrypt';

class userAdminClass {
  
    // авторизация - принимаем логин и прароль
    async loginAdmin(client_arr) {
      try {
          // достаем из БД данные по указанной почте
          const query = {
            text: 'SELECT * FROM admin_user WHERE email = $1',
            values: [client_arr.email]
          };

          const result = await connDB.query(query);

          if (result.rowCount == 0)
          {
            return {'isOk':false, 'msg':'Пошта не знайдена'};
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
                return {isOk:true, msg:'Вдалий вхід', id:result.rows[0].adminid, name:result.rows[0].name, position:result.rows[0].position}; 
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

    async checkEmailInDB(email) {
        // проверка почты на наличие в базе данных
        try {
  
          const query = {
            text: 'SELECT COUNT(email) as countemail FROM admin_user WHERE email = $1',
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

      async checkAuthorization(cookies) 
      { // проверяем авторизацию по куки ts_admin

        let result = {};

        try {
          if (!cookies.ts_admin) {
            result.IsLogin = false;
            result.userIdNow = null;
            result.userName = null;
            result.userPosition = null;
            
          }
          else
          {
            const cookieValue = await JSON.parse(cookies.ts_admin);
            
            if (cookieValue.id === false) {
              result.IsLogin = false;
              result.userIdNow = null;
              result.userName = null;
              result.userPosition = null;
              
            }
      
            if (typeof cookieValue.id === 'number') {
              result.IsLogin = true;
              result.userIdNow = cookieValue.id;
              result.userName = cookieValue.name;
              result.userPosition = cookieValue.position;
              
            }
          }
          
          return result;
        } catch (error) {
          console.error(error);
          return 'Error in clientClass';
        }
      }

}
  
  export default new userAdminClass();