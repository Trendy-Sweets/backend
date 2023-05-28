import { connDB } from '../../index.js';
class sloganClass {
  
    async getSlogan() {
      try {

        const query = {
          text: 'SELECT * FROM advertising_slogan ORDER BY RANDOM() LIMIT 1',
          values: '',
          rowMode: '' //'array',
        }

        const result = await connDB.query(query);
                      
        //console.log('GET RANDOM slogan result = ' + result.rows[0].slogan_text);

        return result.rows[0].slogan_text;
        
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
  
  export default new sloganClass();