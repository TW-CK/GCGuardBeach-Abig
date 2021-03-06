const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

//引入users
const profiles = require('./routes/api/profiles');
const finds = require('./routes/api/finds');
const admins = require('./routes/api/admins');
const news = require('./routes/api/news');
const msgs = require('./routes/api/msgs');
const stores = require('./routes/api/stores');

// DB config
const db = require('./config/keys').mongoURI;

// 使用body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect
mongoose.connect(db)
    .then(() => {
        console.log('成功');
    })
    .catch((err) => {
        console.log(err);
    })

// passport初始化
app.use(passport.initialize());
require('./config/adminPassport')(passport);


//使用routes
app.use('/api/profiles', profiles);
app.use('/api/finds', finds);
app.use('/api/admins', admins);
app.use('/api/news', news);
app.use('/api/msgs', msgs);
app.use('/api/stores', stores);

app.listen(5000, () => {
    console.log('the port running');
})
