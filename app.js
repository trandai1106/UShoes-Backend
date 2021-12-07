const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const authRouter = require('./routes/auth');
const customerRouter = require('./routes/customer');
const adminRouter = require('./routes/admin');

const app = express();
var upload = multer();

require('dotenv').config();

mongoose.connect(process.env.DATABASE);

const corsOptions = {
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
};
app.use(cors(corsOptions));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// for parsing application/json
app.use(express.json());
// for parsing multipart/form-data
app.use(upload.array()); 

app.use(express.static('public'));

app.get('/test', (req, res) => {
    const { phone, password, number } = req.body;
    console.log(req.body.password == '');
    console.log(req.body.password === '');
    console.log(req.body.password == undefined);
    console.log(req.body.password === undefined);
    console.log(phone + ' ' + password + ' ' + number);
});

app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/system', adminRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server listening at port ' + port);
})