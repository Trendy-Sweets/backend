import config from './config.json' assert { type: "json" };
import express, { json } from 'express';
import pg from 'pg';
import routerProduct from './inc/router/ProductRouter.js';
import routerAdmin from './inc/router/AdminRouter.js';
import routerExecuter from './inc/router/ExecuteRouter.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const PORT = config.PORT;
const connDB = new pg.Client(config.connDB);

export { connDB };

const app = express();
app.use(express.json());//что бы экспресс мог понят json формат
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/admin', routerAdmin);
app.use('api/execute', routerExecuter);
app.use('/api', routerProduct);



async function startBackend(){
    try {

        await connDB.connect()
            .then(() => console.log('Connected to PostgreSQL database'))
            //.catch(err => console.error('Connection error', err.stack));

        app.listen(PORT, () => console.log('Server its begin WORK - '+ PORT));
           
    } catch(err) {
        console.log('Errrorrr');
    }

};

startBackend();