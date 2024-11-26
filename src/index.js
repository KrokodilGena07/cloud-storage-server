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
const fileUpload = require('express-fileupload');
const path = require('path');
const greenLog = require('./utils/greenLog');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({}));
app.use('/api/static', express.static(path.resolve(process.env.BASE_PATH, 'images')));
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
        app.listen(PORT, () => greenLog(`Server started on PORT ${PORT}`));
        console.log()
    } catch (e) {
        console.log(e);
    }
};

start().then();