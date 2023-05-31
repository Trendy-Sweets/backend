import { time } from "console";

class validFormClass {
  
    constructor() {
        this.result = {
            "isOk": false,
            "msg": ""
        };

        this.passwordMinLenght = 6;
    }

    async checkName(name) {
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (name === undefined || name === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Імʼя - порожнє!";
        }
        else if (name.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Імʼя - порожнє!";
            
        }
        else
        {
            //  проверка на запрещенные символы - разрешены только буквы лат и киррилица
            const regex = /^[a-zA-Zа-яА-Я]+$/;
            const isValid = regex.test(name);
            
            if (isValid) {
                // Поле `name` содержит только буквы латинского алфавита или кириллицы
               this.result.isOk = true;
               this.result.msg = "Поле імʼя - корректне";
               
            } else {
                this.result.isOk = false;
                this.result.msg = "Поле Імʼя містить некорректні символи. Дозволено - лише літери.";
              
            }
        }

        return this.result;
        
      } catch (error) {
        console.error(error);
        this.result.isOk = false;
        this.result.msg = "Виникла невідома помилка при валідації поля Імʼя";
        return this.result;
      }
    }

    async checkEmail(email) {
        this.result = {};
        try {
          // проверяем пустое поле или нет
            if (email === undefined || email === null) {
                this.result.isOk = false;
                this.result.msg  = "Поле Email - порожнє!";
            }
            else if (email.trim().lenght === 0)
            {
                this.result.isOk = false;
                this.result.msg  = "Поле Email - порожнє!";
                
            }
            else {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isValid = regex.test(email);
                
                if (isValid) {
                    this.result.isOk = true;
                    this.result.msg  = "Поле Email - корректне";
                } else {
                    this.result.isOk = false;
                    this.result.msg  = "Поле Email - має не валідне значення";
                }
            }
        
            return this.result;
          
        } catch (error) {
          console.error(error);
          this.result.isOk = false;
          this.result.msg = "Виникла невідома помилка при валідації поля Email";
          return this.result;
        }
      }

      async checkPassword(password) {
        this.result = {};
        try {
          // проверяем пустое поле или нет
            if (password === undefined || password === null) {
                this.result.isOk = false;
                this.result.msg  = "Поле Password - порожнє!";
            }
            else if (password.trim().lenght === 0)
            {
                this.result.isOk = false;
                this.result.msg  = "Поле Password - порожнє!";
                
            }
            else if (password.lenght <= this.passwordMinLenght)
            {
                this.result.isOk = false;
                this.result.msg = "Довжина паролю має бути більше або дорівнює " + this.passwordMinLenght + " символів";
            }
            else {
                const regex = /^[a-zA-Z0-9]+$/;
                const isValid = regex.test(password);
                
                if (isValid) {
                    this.result.isOk = true;
                    this.result.msg  = "Поле Password - корректне";
                } else {
                    this.result.isOk = false;
                    this.result.msg  = "Поле Password - має не валідне значення (маэ бути лише латинські літери та цифри)";
                }
            }
        
            return this.result;
          
        } catch (error) {
          console.error(error);
          this.result.isOk = false;
          this.result.msg = "Виникла невідома помилка при валідації поля Password";
          return this.result;
        }
      }

      async comparePassword(password, repassword)
      {
        this.result = {};
        if (password == repassword)
        {
            this.result.isOk = true;
            this.result.msg  = "Паролі співпадають";
        }
        else
        {
            this.result.isOk = false;
            this.result.msg = "Вказані різні паролі";
        }
        return this.result;
      }
  }
  
  export default new validFormClass();