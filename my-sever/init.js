const mongoose = require('mongoose');
const db = 'mongodb://localhost/linquan';

//引入schema
const glob = require('glob');
const path = require('path');

exports.initSchema = ()=>{
    glob.sync(path.resolve(__dirname,'./model','*.js')).forEach(require)
};

exports.connect = () => {
    //连接数据库
    mongoose.connect(db, {userNewUrlParser: true,useUnifiedTopology: true});

    mongoose.connection.on("connected", function () {
        console.log("MongoDB connected success.")
    });
    //数据库出现错误
    mongoose.connection.on("error", function () {
        console.log("MongoDB connected fail.")
    });

    mongoose.connection.on("disconnected", function () {
        console.log("MongoDB connected disconnected.")
    });

};