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

        let result = {
          IsLogin: false,
          userIdNow: null,
          userName: null
        };

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


      async addClientToDB(client_arr) 
      {
        try {
            const { email, phone, fio, password, repassword, addres, anketa_oldwork, anketa_stag, anketa_medkarta, anketa_year, anketa_child } = client_arr;
              // Генерация хэша пароля
              const saltRounds = 10; // Количество раундов соли
              const hashedPassword = await bcrypt.hash(password, saltRounds);
              //console.log(client_arr);
              // Запрос на добавление записи в таблицу
              const query = {
                text: 'INSERT INTO executer (email, password, fio, phone, allowed, ready, addres) ' +
                      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING executer_id',
                values: [email, hashedPassword, fio, phone, 0, 0, addres]
              };
              
              const result = await connDB.query(query);
              
              if (result.rowCount > 0) 
              {
                const executerId = result.rows[0].executer_id;
                console.log('Создан новый executer с executer_id:', executerId);

                const query2 = {
                    text: 'INSERT INTO executer_anketa (executer_id, old_work_place, experience, medkarta, year, child) ' +
                          'VALUES ($1, $2, $3, $4, $5, $6)',
                    values: [executerId, anketa_oldwork, anketa_stag, anketa_medkarta, anketa_year, anketa_child]
                  };
                  const result2 = await connDB.query(query2);
                  if (result2.rowCount > 0) 
                {
                    return true;
                }
                else
                {
                    return false;
                }
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

      // получаме списко ВСЕЗ продуктов и крепим к нему значение полей об обучении конкретного исполнителя
      async getEducationProductList(executer_id)
      {
         let result = {
          error:false,
          errorMSG: '',
          toReturn: []
         };

          const sql_products = {
            text: 'SELECT *  '+
                  'FROM product ',
            values:[]
          };

          const temp = await connDB.query(sql_products);

          console.log(temp.rowCount);
          if (temp.rowCount > 0)
          {
              const sql_education = {
                text: 'SELECT * FROM know_product WHERE executer_id = $1',
                values: [executer_id]
              };

              const temp_ed = await connDB.query(sql_education);
              console.log(temp_ed.rowCount);
          } 
          else
          {
            result.error = true;
            result.errorMSG = 'Не має продуктів для навчання';
          }

          return result;
      }

}
  
  export default new userExecClass();