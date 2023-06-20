import productClass from '../../class/client/productClass.js';
import sloganClass from '../../class/client/sloganClass.js';
import clientClass from '../../class/client/clientClass.js';
import validFormClass from '../../class/global/validFormClass.js';
import config from '../../../config.json' assert { type: "json" };

class ProductController {
    async getMainPage(req, res) {
        //console.log('get main page ...');
        let status_login = await clientClass.checkAuthorization(req.cookies); // Проверка авторизации 
        try {
        
            const result = await sloganClass.getSlogan();
            const products = await productClass.getProductGroup_list();
            const klient_arr = {
                IsLogin: status_login.IsLogin,
                clientId: status_login.userIdNow,
                clientName: status_login.userName
            };
            let cart       = {
                allCartPrice: 0,
                allProductCount: 0
            };
            
            let error = false;
            let errorMSG = "";
            if (!result) 
            {
                error = true;
                errorMSG = "Problem in Get Slogan";
            }
            if (products.msg !="ok")
            {
                error = true;
                errorMSG = products.error;
            }
            // if products.msg == "ok" - то все хорошо
            // если  .msg ==  error  - то были проблемы с получением данных
            // текст ошибки лежит в products.error
            // *** смотрим корзину
            
            const temp = await validFormClass.validCookieCart(req.cookies.cart);
            if (temp.isOk)
            { // с кукой все ок
              // значит все ключи - цифры // уже ок - можно передавать на обработку
                const cartItems = await JSON.parse(req.cookies.cart);
                // получаем инфу о продуктах
                const id_list = Object.keys(cartItems);
                let product_info_rows = await productClass.getProductListByListId(id_list);

                if (!product_info_rows.error)
                {
                    let allCartPrice = 0;
                    let countProduct = 0;
                    const modifiedToReturn = product_info_rows.toReturn.map(item => {
                                
                                countProduct += cartItems[item.productid];
                                allCartPrice += item.price * cartItems[item.productid];
                                return { ...item};
                    });
                            
                    cart.allCartPrice    = allCartPrice;
                    cart.allProductCount = countProduct;

                }
                else
                {
                    cart.allCartPrice    = 0;
                    cart.allProductCount = 0;
                }
            }
            else
            {
                cart.allCartPrice    = 0;
                cart.allProductCount = 0;
            }
            // ******************
            const tosend = {
                slogan: result,
                products: products.toReturn,    //array
                сlient: klient_arr,             // status_log:false/true login: name: idclient
                cart: cart,                     // состояние корзины
                error: false,
            };
            res.json(tosend);
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async checkNowCart (cookies_cart)
    {
        let cart = {
            allCartPrice: 0,
            allProductCount: 0
        };
            

        return cart;
    };

    // Страница товара (новый вариант)
    // Выводим инфу о товара с его айдишником и сопровождаем массивов других вариаций товарв из его группы
    async getProductInfoById(req, res)
    {
        try {
            const {idProduct} = req.params;
            console.log('idProduct = '+ idProduct);
            const temp_productInfo = await productClass.getProductInfoById(idProduct);
            
            var tosend = {};

            if (temp_productInfo.msg == 'ok')
            {
                // получем список других товаров из этой же группы
                //console.log('nomer category =  '+temp_productInfo.toReturn.groupid);
                const temp_list  = await productClass.getProductsListInGroup(temp_productInfo.toReturn.groupid);
                let cart = {};

                const temp = await validFormClass.validCookieCart(req.cookies.cart);
                if (temp.isOk)
                { // с кукой все ок
                // значит все ключи - цифры // уже ок - можно передавать на обработку
                    const cartItems = await JSON.parse(req.cookies.cart);
                    // получаем инфу о продуктах
                    const id_list = Object.keys(cartItems);
                    let product_info_rows = await productClass.getProductListByListId(id_list);

                    if (!product_info_rows.error)
                    {
                        let allCartPrice = 0;
                        let countProduct = 0;
                        const modifiedToReturn = product_info_rows.toReturn.map(item => {
                                    
                                    countProduct += Number(cartItems[item.productid]);
                                    allCartPrice += item.price * cartItems[item.productid];
                                    return { ...item};
                        });
                                
                        cart.allCartPrice    = allCartPrice;
                        cart.allProductCount = countProduct;

                    }
                    else
                    {
                        cart.allCartPrice    = 0;
                        cart.allProductCount = 0;
                    }
                }
                else
                {
                    cart.allCartPrice    = 0;
                    cart.allProductCount = 0;
                }

                tosend = {
                    prtoductInfo: temp_productInfo.toReturn,
                    products: temp_list.toReturn, //array
                    cart: {
                        allCartPrice: cart.allCartPrice,
                        allProductCount: cart.allProductCount
                    },
                    error: false,
                    errorMSG: "",
                };
                
                res.json(tosend);

            }
            else
            {
                tosend = {
                    prtoductInfo: {},
                    products: {}, 
                    error: true,
                    cart: {
                        allCartPrice: 0,
                        allProductCount: 0
                    },
                    errorMSG: temp_productInfo.error,
                };
               res.json(tosend)
            }
            
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    // Старый вариант, когда выводли инфу о группе ---- страница просмотра конкретного товара - данные о товаре
    async getProdctGroupInfo(req, res) {
        try {
            const {idGroup} = req.params;
            console.log('ProdctGroup Page. IdGroup = ' + idGroup);
            
            const temp_group = await productClass.getProductGroupInfo(idGroup);
            const temp_list  = await productClass.getProductsListInGroup(idGroup);
            const klient_arr = {};
            
            // if temp_group/temp_list.msg == "ok" - то все хорошо
            // если  .msg ==  error  - то были проблемы с получением данных
            // текст ошибки лежит в temp_group/temp_list.error
            const tosend = {
                groupInfo: temp_group.toReturn, //  информация о группе продуктов
                products: temp_list.toReturn,   // список вариаций продукта
                сlient: klient_arr,             // status_log:false/true login: name: idclient
                
                error: false,
            };

            //console.log('productGroup - ' + tosend.groupInfo);
            res.json(tosend);


        } catch (error) {
            //console.log(error);
            res.status(500).json(error.message);
        }
    }

      // загрузка данных о товарах в корзине
    async getProductInCart(req, res) {
        try {
            
                let result = {
                    countProduct:0,
                    products:'',
                    allCartPrice:0,
                    beforTAXFree:0,
                    error:false,
                    msgError: '',
                };
                    // Разбираем данные из куки-файла
                    const temp = await validFormClass.validCookieCart(req.cookies.cart);
                    if (temp.isOk)
                    { // с кукой все ок
                        // значит все ключи - цифры // уже ок - можно передавать на обработку
                        const cartItems = await JSON.parse(req.cookies.cart);
                        // получаем инфу о продуктах
                        const id_list = Object.keys(cartItems);
                        let product_info_rows = await productClass.getProductListByListId(id_list);

                        let allCartPrice = 0;
                        let countProduct = 0;
                        if (!product_info_rows.error)
                        {
                            
                            const modifiedToReturn = product_info_rows.toReturn.map(item => {
                                const count = cartItems[item.productid];
                                allCartPrice += item.price * Number(count);
                                item.priceOne = item.price;
                                item.price = item.price * Number(count);
                                countProduct += Number(count);
                                return { ...item, count };
                            });
                            
                            result = {
                                countProduct:countProduct,
                                products: modifiedToReturn,
                                allCartPrice: allCartPrice,
                                beforTAXFree:  (config.freeTAX - allCartPrice)<0? 0:(config.freeTAX - allCartPrice),
                                error: false,
                            }
                        }
                        else
                        {
                            result.error = true;
                            result.msgError = product_info_rows.msg;
                        }
                    }
                    else
                    {
                        result.error = true;
                        result.msgError = temp.msg;
                    }
                    
                    res.json(result);
                

            } catch (error) {
                console.log(error);
                res.status(500).json(error.message);
            }
    }


}


export default new ProductController();