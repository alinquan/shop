const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); //加密

const userSchema = new Schema({
    userId: Schema.Types.ObjectId,
    // userName: {unique: true, type: String},  //unique:唯一值
    phone: {unique: true, type: String},  //unique:唯一值
    password: String,
    ctime: {type: Date, default: Date.now()},
});

userSchema.pre('save', function (next) {
    //随机生成salt  10迭代次数
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        })
    })
});

userSchema.methods = {
    comparePassword(_password, password) {
        return new Promise((resolve, reject) => {
            //比较用户密码和数据库加密密码是否一致
            bcrypt.compare(_password, password, (err, res) => {
                if (!err) resolve(res);
                else reject(err)
            })
        })
    },
};

//发布模型
mongoose.model('User', userSchema);