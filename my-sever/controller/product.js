const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');
const fs = require('fs');

//导入json数据
router.get('/insertProductInfo', async (ctx) => {
    fs.readFile('./data/product.json', 'utf8', (err, data) => {
        let dataList = JSON.parse(data);
        console.log(data);
        let count = 0; // 计数器
        const Product = mongoose.model('Product');
        dataList.map((val, index) => {
            console.log(val);
            let product = new Product(val);
            // 随机生成类型 范围是1~8
            product.type = Math.floor(Math.random() * 8) + 1;
            product.save().then(res => {
                count++;
                console.log('成功' + count);
            }).catch(err => {
                console.log('失败啦:' + err);
            })
        });
    });
    ctx.body = '导入数据';
});

router.get('/getProductsByType', async (ctx) => {
    const page = (ctx.query.page - 1) * ctx.query.page_size;
    const page_size = +ctx.query.page_size;
    const Product = mongoose.model('Product');
    let count = 0;
    let num_pages = 0;
    await Product.find({type: ctx.query.typeId}).then(res => {
        count = res.length;
        num_pages = Math.ceil(count / page_size);
    });
    await Product.find({type: ctx.query.typeId}).skip(page).limit(page_size).exec().then(res => {
        ctx.body = {
            data: res,
            page: +ctx.query.page,
            page_size: page_size,
            count: count,
            num_pages: num_pages,
        }
    });
});

router.get('/getDetail', async (ctx) => {
    const Product = mongoose.model('Product');
    await Product.find({_id: ctx.query.id}).exec().then(res => {
        ctx.body = res[0] || {};
    });
});

module.exports = router;