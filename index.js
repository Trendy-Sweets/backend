import config from './config.json' assert { type: "json" };
import express, { json } from 'express';
import pg from 'pg';
import router from './inc/router/ProductRouter.js';
import cookieParser from 'cookie-parser';



const PORT = config.PORT;
const connDB = new pg.Client(config.connDB);

export { connDB };

const app = express();
app.use(express.json());//что бы экспресс мог понят json формат
app.use(cookieParser());
app.use('/api', router);



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