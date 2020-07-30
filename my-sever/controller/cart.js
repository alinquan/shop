const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/addCart', async (ctx) => {
    const Cart = mongoose.model('Cart');
    let cart = new Cart(ctx.request.body);
    await cart.save().then(res => {
        ctx.body = {
            status: 200,
            data: {
                message: '添加成功'
            }
        }
    });
});

router.get('/getCart', async (ctx) => {
    const Cart = mongoose.model('Cart');
    await Cart.find({'userId': ctx.query.userId}).populate('productId').then(res => {
        ctx.body = res;
    });
});

router.post('/delCart', async (ctx) => {
    const Cart = mongoose.model('Cart');
    await Cart.deleteOne({'productId': ctx.request.body.productId, 'userId': ctx.request.body.userId}).then(res => {
        ctx.body = {
            status: 200,
            data: {
                message: '删除成功'
            }
        }
    }).catch(err=>{
        ctx.response.status = 400;
        ctx.body = {detail: {msg:'删除失败'}};
    });
});

module.exports = router;