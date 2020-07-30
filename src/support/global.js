

import { Toast, Notify } from 'vant';

const storage = window.localStorage;

let isOnline = true; // 是否 联网状态

export default {
    extendObj: null, // extension.js 中的方法
    setWindowEvent () {

        let screenHeight = document.documentElement.clientHeight || document.body.clientHeight;

        // 网络断开、连接提醒
        window.addEventListener('offline', () => {
            if (isOnline) {
                Notify({
                    message: '网络连接断开',
                    duration: 2000,
                    background: '#fa4451'
                });
                isOnline = false;
            }
        });
        window.addEventListener('online', () => {
            if (!isOnline) {
                Notify({
                    message: '网络连接正常',
                    duration: 2000,
                    background: '#2195f2'
                });
                isOnline = true;
            }
        });

        // 微信浏览器 IOS 弹出键盘后，键盘消失时页面下方会留白
        // 参照：https://www.cnblogs.com/ziChin/p/10278016.html

        if (this.isWXBrowser()) {
            document.body.addEventListener('blur', (e) => {
                alert('blur');
                console.log(e)
                window.scroll(0, 0);
                window.innerHeight = window.outerHeight = screenHeight;
            });
        }
    },
    isWXBrowser () {
        return /micromessenger/.test(navigator.userAgent.toLowerCase());
    },
    init (extend) {
        this.extendObj = extend;
        this.setWindowEvent();
    },
    // 通过 token 获取用户信息
    getStaffAuths (token, cb) {
        let extension = this.extendObj;
        if(!extension) {
            Toast({
                message: "初始化失败，请重新进入网页",
                duration: 3000,
            });
            return;
        }
        extension.$setToken(token);
        extension.$get(extension.$API.auth + 'info/').then(data => {
            // console.log("data: ", data);
            extension.$setStorage('PinBaAuths', data);
            typeof cb == 'function' && cb();
        }).catch(data => {
            extension.$removeLoginStatus();
            extension.$backToLogin(cb);
        });
    },
    loginStatusCheck (cb) {
        let token = this.getQueryString('token');
        let plat = this.getQueryString('plat');
        if(plat) {
            console.log("plat: ", plat)
            storage.setItem('_platform', plat);
        }
        if(token) {
            this.getStaffAuths(token, cb);
        } else {
            typeof cb === 'function' && cb();
        }

    },
    // 获取页面url参数
    getQueryString (name) {
        var reg = new RegExp(name + '=([^&]*)(&|$)');
        var r = window.location.search.match(reg);
        return r && r[1];
    },

};





