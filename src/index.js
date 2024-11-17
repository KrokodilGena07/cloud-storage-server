const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv/config');
const router = require('./router');
const db = require('./config/db');
require('./models/index');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use('/api', router);

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