const Koa = require('koa');
const app = new Koa();

//解决跨域问题
const cors = require('koa2-cors');
app.use(cors());

//中间件 获取前端post请求参数
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

//加载路由
const Router = require('koa-router');
let router = new Router();
let user = require('./controller/user');
let product = require('./controller/product');
let type = require('./controller/type');
let cart = require('./controller/cart');
router.use('/user', user.routes());
router.use('/product', product.routes());
router.use('/type', type.routes());
router.use('/cart', cart.routes());
app.use(router.routes());
app.use(router.allowedMethods());

const {connect, initSchema} = require('./init');
(async () => {
    /*连接完数据库在引入数据模型*/
    await connect();
    initSchema();
})();

app.listen(3000, () => {
    console.log('成功');
});