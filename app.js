var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mqtt = require('mqtt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var subscribeMqttRouter = require('./routes/subscribemqtt');

const host = '';//填写mqtt地址
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const topic = 'green';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/subscribe-mqtt', subscribeMqttRouter);


const client = mqtt.connect(host, {
  clientId,
  username: "",//用户名
  password: "",//密码
  connectTimeout: 5000,
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("Connected~");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic ${topic}`);
  });
});

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
})

module.exports = app;
