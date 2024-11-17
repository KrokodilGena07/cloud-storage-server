const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv/config');
const router = require('./router');
const db = require('./config/db');
require('./models/index');
const errorMiddleware = require('./middlewares/errorMiddleware');
const compression = require('compression');
const compressionMiddleware = require('./middlewares/compressionMiddleware');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(compression({filter: compressionMiddleware}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await db.authenticate();
        await db.sync();
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start()