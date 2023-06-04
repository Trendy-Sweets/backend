import { time } from "console";
import region_list from '../lib/region.json' assert { type: "json" };
import city_list from '../lib/city.json' assert { type: "json" };

class validFormClass {
  
    constructor() {
        this.result = {
            isOk: false,
            msg: ""
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

      // проверяет куку с корзиной товаров на базовіе ошибки 
      async validCookieCart(cart)
      {
        this.result = {};
        if (cart)
            {
                const cartItems = await JSON.parse(cart);
                // получаем инфу о продуктах
                const id_list = Object.keys(cartItems);
                if (id_list.length === 0) {
                    this.result.isOk = false;
                    this.result.msg = 'Кошик порожній. Додайте необхідні солодощі спочатку.';
                }
                else {
                    let flag_id = true;
                    for (let i = 0; i < id_list.length; i++) {
                        const idProduct = id_list[i];
                        if (isNaN(Number(idProduct))) {
                            flag_id = false;
                        }
                    } 
                    // проверяем что мы там получили с ключами
                    if (flag_id)
                    {
                        this.result.isOk = true;
                        this.result.msg = "";
                    }
                    else
                    {
                        this.result.isOk = false;
                        this.result.msg = 'Помилка в кукі файлі. Невірні дані для обробки';
                    }
                }
            }
            else
            {
                this.result.isOk = false;
                this.result.msg = 'Відсутній файл cookie cart';
            }
        return this.result
      }
    
      async checkPhone(phone) {
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (phone === undefined || phone === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Телефон - порожнє!";
        }
        else if (phone.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Телефон - порожнє!";
            
        }
        else
        {
            //  проверка на запрещенные символы - разрешены только цифры
            // корректный номер - +38(123)456 78 90
            const regex = /^\+38\(\d{3}\)\d{3}\s\d{2}\s\d{2}$/;
            const isValid = regex.test(phone);
            
            if (isValid) {
                // Поле `name` содержит только буквы латинского алфавита или кириллицы
               this.result.isOk = true;
               this.result.msg = "Поле Телефон - корректне";
               
            } else {
                this.result.isOk = false;
                this.result.msg = "Поле Телефон містить некорректні символи. Дозволено - +38(123)456 78 90.";
              
            }
        }

        return this.result;
        
      } catch (error) {
        console.error(error);
        this.result.isOk = false;
        this.result.msg = "Виникла невідома помилка при валідації поля Телефон";
        return this.result;
      }
    }

    async checkRegion(region) { 
        // проверка переданного региона 
        // передаем код региона - должен соответствовать нашему набору регионов
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (region === undefined || region === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Область - порожнє!";
        }
        else if (region.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Область - порожнє!";
            
        }
        else
        {
            // тут провеям, что выбранный код у нас есть в списке
            if (region in region_list)
            {
                this.result.isOk = true;
                this.result.msg = 'Поле Область - корректне';
            }
            else
            {
                this.result.isOk = false;
                this.result.msg  = 'Поле Область містить не корректний запис';
            }
        }

        return this.result;
        
      } catch (error) {
        console.error(error);
        this.result.isOk = false;
        this.result.msg = "Виникла невідома помилка при валідації поля Область";
        return this.result;
      }
    }

    async checkCity(city,region) { 
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (city === undefined || city === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Місто - порожнє!";
        }
        else if (city.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Місто - порожнє!";
            
        }
        else
        {
            // тут провеям, что выбранный код у нас есть в списке
            if (city in city_list[region])
            {
                this.result.isOk = true;
                this.result.msg = 'Поле Місто - корректне';
            }
            else
            {
                this.result.isOk = false;
                this.result.msg  = 'Поле Місто містить не корректний запис';
            }
        }

        return this.result;
        
      } catch (error) {
        console.error(error);
        this.result.isOk = false;
        this.result.msg = "Виникла невідома помилка при валідації поля Місто";
        return this.result;
      }
    }

    async checkAdress(adress) {
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (adress === undefined || adress === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Адреса - порожнє!";
        }
        else if (adress.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Адреса - порожнє!";
            
        }
        else
        {
            //  проверка на запрещенные символы - разрешены только буквы лат и киррилица
            const regex = /^[\p{L}\d\s.,\-/]+$/u;
            const isValid = regex.test(adress);
            
            if (isValid) {
                // Поле `name` содержит только буквы латинского алфавита или кириллицы
               this.result.isOk = true;
               this.result.msg = "Поле Адреса - корректне";
               
            } else {
                this.result.isOk = false;
                this.result.msg = "Поле Адреса містить некорректні символи.";
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
    
    async checkDate(date, maxtime) {
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (date === undefined || date === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Дата - порожнє!";
        }
        else if (date.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Дата - порожнє!";
            
        }
        else
        {
            // 04.05.2023
            const regex = /^(0[1-9]|[1-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
            const isValid = regex.test(date);
            
            if (isValid) {
                // проверяем чтоб указанная дата была позже текущей + maxtime
                const currentDate = new Date();
                const specifiedDate = new Date(date);
                
                const futureDate = new Date(currentDate.getTime() + maxtime * 60 * 60 * 1000);
                const isAfterMaxTime = specifiedDate > futureDate;
                if (isAfterMaxTime)
                {
                    // OKey
                    this.result.isOk = true;
                    this.result.msg = "Поле Дата - корректне";
                }
                else
                {
                    this.result.isOk = false;
                    this.result.msg = "Вказана дата наступає раніше ніж можливий срок доставки!";
                }
            } else {
                this.result.isOk = false;
                this.result.msg = "Поле Дата містить некорректні символи або невірний формат.";
              
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

    async checkTime(time) {
        this.result = {};
      try {
        // проверяем пустое поле или нет
        if (time === undefined || time === null) {
            this.result.isOk = false;
            this.result.msg  = "Поле Час - порожнє!";
        }
        else if (time.trim().lenght === 0)
        {
            this.result.isOk = false;
            this.result.msg  = "Поле Час - порожнє!";
            
        }
        else
        {
            // разрешено только 9 - 19 диапозон чисел
            const regex = /^(?:1[0-9]|9)$/;
            const isValid = regex.test(time);
            
            if (isValid) {
               
               this.result.isOk = true;
               this.result.msg = "Поле Час - корректне";
               
            } else {
                this.result.isOk = false;
                this.result.msg = "Поле Час містить некорректні символи або виходить за діапазон від 9 до 19";
              
            }
        }

        return this.result;
        
      } catch (error) {
        console.error(error);
        this.result.isOk = false;
        this.result.msg = "Виникла невідома помилка при валідації поля Час";
        return this.result;
      }
    }
  }
  
  export default new validFormClass();