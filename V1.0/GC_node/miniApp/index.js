const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const Chats = require('./models/Chats');

// 引入ws
const ws = require("nodejs-websocket");
const Time = require("./utils/formatTimes");

// 小程序端数据获取接口
const miniUsers = require('./routes/miniapi/users');
const miniNews = require('./routes/miniapi/news');
const miniFinds = require('./routes/miniapi/finds');
const miniEmails = require('./routes/miniapi/emails');
const miniChats = require('./routes/miniapi/chats');
const miniMsgs = require('./routes/miniapi/msgs');
const miniUtils = require('./routes/miniapi/utils');
const miniStores = require('./routes/miniapi/stores');

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

app.use(passport.initialize());
require('./config/userPassport')(passport);


// 小程序端
app.use('/mini/users', miniUsers);
app.use('/mini/news', miniNews);
app.use('/mini/finds', miniFinds);
app.use('/mini/emails', miniEmails);
app.use('/mini/chats', miniChats);
app.use('/mini/msgs', miniMsgs);
app.use('/mini/utils', miniUtils);
app.use('/mini/stores', miniStores);

app.listen(5001, () => {
    console.log('the mini port running');
})

// 聊天
var server = ws.createServer(function (conn) {
    console.log("connected！！！")
    const time = new Time()
    conn.on("text", function (dataTemp) {
        let data = JSON.parse(dataTemp)
        data.time = time.formatTime(new Date());
        console.log(`${data.name}:${data.str}`)
        if (data.type == 2 || data.type == 3) {
            new Chats({
                type: data.type,
                name: data.name,
                avatar: data.avatar,
                room: data.room,
                str: data.str,
                time: data.time
            }).save().then(str => {
                console.log(str)
            })
        }
        switch (data.type) {
            case 0:
                conn.name = data.name;
                conn.avatar = data.avatar;
                conn.time = data.time;
                data.str = "加入了房间";
                broadcast(JSON.stringify(data))
                break;
            case 2:
            case 3:
                broadcast(JSON.stringify(data))
                break;
            default:
                break;
        }
    })
    conn.on("error", function (err) {
        console.log(err)
    })
    conn.on("close", function (code, reason) {
        broadcast(JSON.stringify({
            name: conn.name,
            avatar: conn.avatar,
            time: conn.time,
            type: 0,
            str: '离开了房间'
        }))
    })
}).listen(5002, function () {
    console.log('the ws port running');
});

function broadcast(msg) {
    console.log(server.connections)
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}