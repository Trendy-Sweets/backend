import { connDB } from '../../../index.js';
import bcrypt from 'bcrypt';

class userExecClass {
  
    // авторизация - принимаем логин и прароль
    async loginExecuter(client_arr) {
      try {
          // достаем из БД данные по указанной почте
          const query = {
            text: 'SELECT * FROM executer WHERE email = $1',
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
                return {isOk:true, msg:'Вдалий вхід', id:result.rows[0].executer_id, name:result.rows[0].fio}; 
              }
          }
          
      } catch (error) {
        console.error(error);
        return 'Error in userExecClass';
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
            text: 'SELECT COUNT(email) as countemail FROM executer WHERE email = $1',
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
      { // проверяем авторизацию по куки ts_executer

        let result = {};

        try {
          if (!cookies.ts_executer) {
            result.IsLogin = false;
            result.userIdNow = null;
            result.userName = null;
            
          }
          else
          {
            const cookieValue = await JSON.parse(cookies.ts_executer);
            
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
          return 'Error in userExecClass';
        }
      }

}
  
  export default new userExecClass();