const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/registUser', async (ctx) => {
    //获取model
    const User = mongoose.model('User');
    // 接受post请求封装成user对象
    let newUser = new User(ctx.request.body);
    // 使用save保存用户信息
    await newUser.save().then(() => {
        ctx.body = {
            status: 200,
            message: '注册成功'
        }
    }).catch(err => {
        ctx.response.status = 400;
        if (err.code === 11000) {
            ctx.body = {detail: {msg: '该手机号已被注册！'}};
        } else {
            ctx.body = err;
        }
    });
});

router.post('/loginUser', async (ctx) => {
    const data = ctx.request.body;
    let phone = data.phone;
    let password = data.password;
    // 引入model
    const User = mongoose.model('User');
    // 查询用户名是否存在 存在再去比较密码
    await User.findOne({phone: phone}).exec().then(async result => {
        if (result) {
            const newUser = new User();
            await newUser.comparePassword(password, result.password).then(res => {
                if(res){
                    ctx.body = {
                        status: 200,
                        message: '登录成功',
                        userInfo: result
                    };
                }else{
                    ctx.response.status = 400;
                    ctx.body = {detail: {msg: '密码错误'}};
                }
                console.log(res, 'res');
            })
        } else {
            ctx.response.status = 400;
            ctx.body = {detail: {msg: '该手机号暂未注册'}};
        }
    })

});


module.exports = router;