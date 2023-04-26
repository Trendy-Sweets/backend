import { connDB } from '../../index.js';
class clientClass {
  
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