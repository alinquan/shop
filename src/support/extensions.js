import axios from './axiosConfig'; // 引入 axios
import {ImagePreview} from 'vant';

const storage = window.localStorage;
const ENV = process.env.NODE_ENV;

// 上传图片文件，加headers
// headers:{'Content-Type':'multipart/form-data'}
function http(url, data, type, isFile) {
    if (type == 'GET') {
        url += '?';
        for (const key in data) {
            url += key + '=' + data[key] + '&';
        }
    }
    const config = {
        url: url.replace(/&$/, ''),
        method: type,
        data: data
    };
    // console.log("http: ", type);
    // console.log("http: ", data);
    if (isFile) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }
    return axios(config);
}

export default {
    $API: {
        auth: '/api/v1/madmin/base/auth/', // 用户权限状态
        staff: '/api/v1/madmin/base/staff/', // 员工
        msg: '/api/v1/madmin/base/message/', // 消息
        tags: '/api/v1/madmin/base/tags/', // 分组
        car3Trip: '/api/v1/madmin/off3/order/', // 公务车3 - 行程管理
        car3Vehicle: '/api/v1/madmin/off3/vehicle/', // 公务车3 - 车辆列表
        car3Driver: '/api/v1/madmin/off3/driver/', // 公务车3 - 司机列表
        car3DriverTrip: '/api/v1/madmin/off3/trip/', // 公务车3 - 司机行程
        car3FeeType: '/api/v1/madmin/off3/fee_type/', // 公务车3 - 费用类型
        car3Location: '/api/v1/madmin/off3/locations/', // 公务车3 - 定位轨迹
        car3Rule: '/api/v1/madmin/off3/rule/', // 公务车3 - 配置规则
        car3OrderType: '/api/v1/madmin/off3/order_type/', // 公务车3 - 用车类型

        registUser: '/user/registUser', // 注册
        loginUser: '/user/loginUser', // 登录
        productType: '/type/getTypes', // 类型
        getProductsByType: '/product/getProductsByType', // 商品
        getProductsDetail: '/product/getDetail', // 详情
        cart: '/cart' // 购物车
    },
    $get(url, data) {
        return http(url, data, 'GET');
    },
    $post(url, data, isFile) {
        return http(url, data, 'POST', isFile);
    },
    $put(url, data) {
        return http(url, data, 'PUT');
    },
    $patch(url, data) {
        return http(url, data, 'PATCH');
    },
    $request(url, data) {
        return http(url, data, 'PATCH');
    },
    // token更新 -> axios重新上设置token
    $setToken(token) {
        console.log('$setToken', token);
        window.localStorage.setItem('token', token);
        if (typeof token != 'string' || !token.length) return;
        axios.defaults.headers.Authorization = token;
        console.log(axios.defaults);
    },
    $getRem(px) {
        const iWidth = this.$store.state.winWidth;
        const dRem = this.$store.state.designRem;
        return px / iWidth * dRem || 0;
    },
    $getPx(rem) {
        const iWidth = this.$store.state.winWidth;
        const dRem = this.$store.state.designRem;
        return (iWidth / dRem * rem).toFixed(2) * 1 || 0;
    },
    // 将设计稿的px转换成对应的缩放后的px值
    $getZoomPx(px) {
        // 设计稿375宽度
        const iWidth = this.$store.state.winWidth;
        return (iWidth / 375 * px).toFixed(2) * 1 || 0;
    },
    $phone(phone) {
        if (!phone) return;
        window.open('tel:' + phone);
    },
    /**
     * imgArr
     * 参数 1：[http://~~~~~.img,http://~~~~~.img,http://~~~~~.img,http://~~~~~.img]
     * 参数 2：[
     *      {
     *          title: '01',
     *          src: 'http://~~~~~.img'
     *      },
     *      {
     *          title: '02',
     *          src: 'http://~~~~~.img'
     *      },
     *      {
     *          title: '03',
     *          src: 'http://~~~~~.img'
     *      }
     * ]
     */
    $previewImage(imgs, idx, cb) {
        var imgInst = null;
        imgInst = ImagePreview({
            images: imgs,
            startPosition: idx || 0,
            closeOnPopstate: true, // 是否在页面回退时自动关闭
            onClose() {
                // 取消预览图片时
                typeof cb === 'function' && cb();
            }
        });
        return imgInst;
    },
    // 获取某个css样式的计算属性
    $getCssStyle(dom) {
        return (window.getComputedStyle ? window.getComputedStyle(dom, null) : dom.currentStyle) || {};
    },
    $setStorage(key, value) {
        storage.setItem(key, JSON.stringify(value));
    },
    $getStorage(key) {
        const str = storage.getItem(key);
        if (str === 'undefined') {
            return undefined;
        }
        return str ? JSON.parse(str) : undefined;
    },
    $removeStorage(key) {
        storage.removeItem(key);
    },
    $isAndroid() {
        return /android/i.test(window.navigator.userAgent);
    },
    // 检测是否是微信浏览器
    $isWXBrowser() {
        return /micromessenger/.test(navigator.userAgent.toLowerCase());
    },
    // 登录状态失败提示
    $bridgeInfo(url, data, cb) {
        console.log('$bridge: ', url);
        this.$bridge.callHandler(url, (data || {}), (data) => {
            typeof cb == 'function' && cb(data);
        });
    },
    $backToLogin(cb) {
        const plat = storage.getItem('_platform');
        if (plat === 'pb') {
            console.log('plat login out');
            this.$bridgeInfo('authFail', {}, (data) => {
                alert('authFail callback' + data);
            });
        } else {
            console.log('normal login out');
            setTimeout(function () {
                window.location.hash = '#/login';
            }, 1500);
        }
        this.$removeLoginStatus();
        typeof cb == 'function' && cb();
    },
    $removeLoginStatus() {
        storage.removeItem('token');
        storage.removeItem('PinBaAuths');
        storage.removeItem('PinBaOpenid');
        storage.removeItem('corpcode');
        storage.removeItem('_platform');
    },
    $getENV() {
        return ENV;
    }
};
