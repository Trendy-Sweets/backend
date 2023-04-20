import { connDB } from '../../index_serv.js';
import productClass from '../class/productClass.js';
import sloganClass from '../class/sloganClass.js';


class ProductController {
    async getMainPage(req, res) {
        console.log('get main page ...');
        try {
            const slogan = new sloganClass(connDB);
            console.log('create slogan class');
            const result = await slogan.getSlogan();
            console.log('Get result ... ok')
        
            const product = new productClass(connDB);
            console.log('create PRODUCt clas');
            const products = await product.getProductGroup_list();
            console.log('Get result ... ok')
    
            const klient_arr = [];
            
            const tosend = {
                'slogan': result,
                'products': products, //array
                'klient': klient_arr // status_log:false/true login: name: idclient
            };
        
            res.json(tosend);
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}


export default new ProductController();