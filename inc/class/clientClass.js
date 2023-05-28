import { connDB } from '../../index.js';
class clientClass {
  
  constructor() {
    this.IsLogin = false;   // если True - значит авторизован
    this.userIdNow = null; // тут будет id usera если он авторизован
  }


    async autoresetionUser() {
      try {

        return 'User in  login';
        
      } catch (error) {
        console.error(error);
        return 'Error in clientClass';
      }
    }
  }
  
  export default new clientClass();