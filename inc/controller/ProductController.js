import productClass from '../class/productClass.js';
import sloganClass from '../class/sloganClass.js';
import clientClass from '../class/clientClass.js';

class ProductController {
    async getMainPage(req, res) {
        console.log('get main page ...');
        try {
        
            const result = await sloganClass.getSlogan();
            const products = await productClass.getProductGroup_list();
            const klient_arr = {
                "IsLogin": clientClass.IsLogin,
                "clientId": clientClass.userIdNow,
                "clientName": clientClass.userName
            };
            
            var error = false;
            var errorMSG = "";
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

            const tosend = {
                slogan: result,
                products: products.toReturn, //array
                klient: klient_arr, // status_log:false/true login: name: idclient
                error: false,
            };
            res.json(tosend);
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
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
                
                tosend = {
                    prtoductInfo: temp_productInfo.toReturn,
                    products: temp_list.toReturn, //array
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
            const klient_arr = [];

            // if temp_group/temp_list.msg == "ok" - то все хорошо
            // если  .msg ==  error  - то были проблемы с получением данных
            // текст ошибки лежит в temp_group/temp_list.error

            const tosend = {
                groupInfo: temp_group.toReturn, //  информация о группе продуктов
                products: temp_list.toReturn, // список вариаций продукта
                klient: klient_arr, // status_log:false/true login: name: idclient
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
                products:'',
                allCartPrice:0,
                error:false,
                msgError: '',
            };

            if (req.cookies.cart)
            {
                // Разбираем данные из куки-файла
                
                const cartItems = await JSON.parse(req.cookies.cart);
                // получаем инфу о продуктах
                const id_list = Object.keys(cartItems);
                if (id_list.length === 0) {
                    //console.error('Корзина пуста. Добавьте товары в корзину.');
                    result.error = true;
                    result.msgError = 'Кошик порожній. Додайте необхідні солодощі спочатку.';
                }
                else {
                    let flag_id = true;
                    for (let i = 0; i < id_list.length; i++) {
                        const idProduct = id_list[i];
                        if (isNaN(Number(idProduct))) {
                            //console.error(`Неверный ключ: ${idProduct}. Ключ должен быть числом.`);
                            flag_id = false;
                        }
                    } 
                    // проверяем что мы там получили с ключами
                    if (flag_id)
                    {
                        // значит все ключи - цифры // уже ок - можно передавать на обработку
                       
                        let product_info_rows = await productClass.getProductListByListId(id_list);
                        //console.log(product_info_rows);

                        if (!product_info_rows.error)
                        {
                            let allCartPrice = 0;
                            const modifiedToReturn = product_info_rows.toReturn.map(item => {
                                const count = cartItems[item.productid];
                                allCartPrice += item.price * count;
                                return { ...item, count };
                            });
                            
                            result = {
                                products: modifiedToReturn,
                                allCartPrice: allCartPrice,
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
                        result.msgError = 'Помилка в кукі файлі. Невірні дані для обробки';
                    }
                }
                
                res.json(result);
            }
            else
            {
                result.error = true;
                result.msgError = 'Відсутній файл cookie cart';
                res.json(result);
            }
            

        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }


}


export default new ProductController();