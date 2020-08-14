
/**
 * 只接受三个参数：
 * serve -- 开发环境
 * test -- 测试环境
 * build -- 正式环境
 */

import { Toast } from 'vant';
const storage = window.localStorage;

const ENV = process.env.NODE_ENV;

const arr = Object.keys(process.env);
console.log('process.env', '==========', arr);
console.log('env.NODE_ENV', '==========', ENV);
console.log('ENV: ENV: ENV: ', ENV);
// console.log("env.NODE_ENV", '==========', Object.prototype.toString.call(arr), arr.length);
// console.log(arr[0], arr[1], arr[2]);
// [].forEach.call(arr, item => {
//     console.log(item, process.env[item])
// });
/**
 * npm run xxx --mode <模式> ，可选模式只有以下三种，否则会默认 development:
 *
 * development 模式用于 vue-cli-service serve
 * production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e
 * test 模式用于 vue-cli-service test:unit
 *
 */

const config = {
    development: {
        // wpSiteUrl: 'http://192.168.104.220:8000',
        // wpSiteUrl: 'http://192.168.104.75:8000',
        // wpSiteUrl: 'http://192.168.104.236:8000',
        // wpSiteUrl: 'http://api.test.pinbayun.com',
        // wpSiteUrl: 'http://119.23.175.115:10009/',
        // wpSiteUrl: 'http://off3_api.test.pinbayun.com'
        wpSiteUrl: 'http://localhost:3000'
        // wpSiteUrl: 'http://off3_api.test.pinbayun.com',
        // wpSiteUrl: 'http://test.pinbayun.com',
        // wpSiteUrl: 'https://api.pinbayun.com',
        // wpSiteUrl: 'http://t2-api.test.pinbayun.com',
        // wpSiteUrl: 'http://szjc-api.test.pinbayun.com',
        // wpSiteUrl: 'https://api.pinbayun.com',
        // wpSiteUrl: 'http://test.pinbayun.com:6090',
        // wpSiteUrl: 'http://szjc-api.test.pinbayun.com',
        // wpSiteUrl: 'http://sa-api.test.pinbayun.com',
        // wpSiteUrl: 'http://master.api.test.pinbayun.com', // 新闻编辑测试配置的服务器
        // webSocketUrl: 'ws://192.168.104.210:8000/notification/',
    },
    // !!!!!!!!!!!!!! 暂时不能用 !!!!!!!!!!!!!!
    test: {
        // wpSiteUrl: 'http://192.168.104.75:8000',
        // wpSiteUrl: 'http://192.168.105.240:8000',
        // wpSiteUrl: 'http://test.pinbayun.com',
        // wpSiteUrl: 'https://api.pinbayun.com',
         wpSiteUrl: 'http://39.105.87.176:3000',
       // wpSiteUrl: 'http://localhost:3000'
        // wpSiteUrl: 'http://api.test.pinbayun.com',
        // wpSiteUrl: 'http://t2-api.test.pinbayun.com',
        // wpSiteUrl: 'http://sa-api.test.pinbayun.com',
        // wpSiteUrl: 'http://szjc-api.test.pinbayun.com',
        // webSocketUrl: 'ws://192.168.104.220:8000/notification/',
    },
    production: {
        // wpSiteUrl: 'http://test.pinbayun.com:6090',
        // wpSiteUrl: 'http://test.pinbayun.com',
        wpSiteUrl: 'https://api.pinbayun.com'
        // wpSiteUrl: 'http://api.test.pinbayun.com',
        // webSocketUrl: 'ws://192.168.104.210:8000/notification/',
    }
};

export default {
    getHttp () {
        return config[ENV].wpSiteUrl || config.development.wpSiteUrl;
    },
    // backToLogin(cb) {
    //     setTimeout(function () {
    //         window.location.hash = '#/login';
    //     }, 1500);
    //     typeof cb == 'function' && cb();
    // },
    backToLogin (cb) {
        const plat = storage.getItem('_platform');
        if (plat === 'pb' && window.$app && typeof $app.$bridge == 'function') {
            console.log('plat login out');
            $app.$bridge('authFail', {}, (data) => {
                alert('authFail callback' + data);
            });
        } else {
            console.log('normal login out');
            setTimeout(function () {
                window.location.hash = '#/login';
            }, 1500);
        }
        typeof cb == 'function' && cb();
    },
    getAxiosConfig () {
        const config = {
            baseURL: this.getHttp(ENV),
            timeout: 300000,
            headers: {}
        };
        const token = window.localStorage.getItem('token'); // 获取token
        console.log('getAxiosConfig', token);
        if (token) { // 如果token不为null，否则传token给后台
            config.headers.Authorization = token;
        } else {
            // this.backToLogin();
        }
        return config;
    },
    ajaxCallback (error) {
        const data = error.response;
        console.log("error -> data: ", data.data);
        const isGovernmentWx = /^b/.test(storage.getItem('corpcode'));
        const statusErrorRule = /^4\d{2}$/;
        let errorTip = '';
        if (statusErrorRule.test(data.status)) {
            const dataResponseDetail = data.data.detail;
            // console.log("data.data: ", data.data);
            if (dataResponseDetail.code == 'AUTH_FAIL') {
                this.removeLoginStatus();
                if (isGovernmentWx) {
                    Toast('ErrorCode：001，请关闭后重新进入!');
                    return; // 企业/政务微信的情况下，禁止进入
                }
                storage.setItem('pathname', location.pathname);
                errorTip = dataResponseDetail.msg;
                Toast(errorTip);
                setTimeout(() => {
                    this.backToLogin();
                }, 1200);
                return;
            } else if (dataResponseDetail.code == 'STAFF_WX_AUTH_FAIL') {
                this.removeLoginStatus();
                errorTip = dataResponseDetail.msg;
            } else if (typeof dataResponseDetail === 'string') {
                errorTip = dataResponseDetail;
            } else if (dataResponseDetail.msg) {
                errorTip = dataResponseDetail.msg;
            } else if (dataResponseDetail.non_field_errors) {
                errorTip = dataResponseDetail.non_field_errors[0];
            } else if (data.responseJSON && data.responseJSON.detail.non_field_errors) {
                errorTip = data.responseJSON.detail.non_field_errors;
            } else if (dataResponseDetail[0] && typeof dataResponseDetail === 'object') {
                errorTip = dataResponseDetail.join(',');
            } else if (typeof dataResponseDetail === 'object') {
                for (const key in dataResponseDetail) {
                    errorTip = key + ': ' + dataResponseDetail[key][0];
                    break;
                }
            } else {
                errorTip = '请求错误';
            }

            setTimeout(() => {
                Toast(errorTip);
            }, 100);
        } else if (/^5\d{2}$/.test(data.status)) {
            Toast('系统异常');
        } else if (data.status == 0) {
            if (navigator.onLine) {
                Toast('请求失败');
            } else {
                Toast('网络连接异常');
            }
        } else {
        }
    },
    removeLoginStatus (error) {
        storage.removeItem('token');
        storage.removeItem('PinBaAuths');
        storage.removeItem('PinBaOpenid');
        storage.removeItem('corpcode');
    }
};
