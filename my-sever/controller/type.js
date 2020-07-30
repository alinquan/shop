const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');
const fs = require('fs');

//导入json数据
router.get('/insertTypeInfo', async (ctx) => {
    fs.readFile('./data/type.json', 'utf8', (err, data) => {
        data = JSON.parse(data);
        let count = 0; // 计数器
        const Type = mongoose.model('Type');
        data.map((val, index) => {
            console.log(val);
            let type = new Type(val);
            type.save().then(res => {
                count++;
                console.log('成功' + count);
            }).catch(err => {
                console.log('失败啦:' + err);
            })
        });
    });
    ctx.body = '导入数据';
});

//获取type列表
router.get('/getTypes', async (ctx) => {
    const Type = mongoose.model('Type');
    await Type.find().exec().then(res => {
        ctx.body = res;
    })
});

module.exports = router;