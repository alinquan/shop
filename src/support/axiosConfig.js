import axios from 'axios';
import $store from '../store.js';
import config from './httpconfig';

const instance = axios.create(config.getAxiosConfig());

// 添加响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        $store.commit('hideLoading');
        console.log(response, 'response');
        // let {data} = response;
        /* if (data.code == "ERROR") {

        } else if (data.detail === '权限验证失败!') {    // 如果后台返回的错误标识为token过期，则重新登录
            // 进行重新登录操作
        } else {
            // 注意返回response.data是拿到返回的真实数据
            return Promise.resolve(response.data)
        } */
        // console.log(response.data)
        return Promise.resolve(response.data);
    },
    (error) => {
        // 对响应错误做点什么
        // 关闭弹窗
        $store.commit('hideLoading');
        config.ajaxCallback(error);
        return Promise.reject(error);
    }
);
export default instance;

// 添加请求拦截器 --- 这个性能不好，暂时不要这么处理，不然每次请求都会设置一次token
/*
instance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        $store.commit('showLoading');
        return config;
    },
    error => {
        // 对请求错误做些什么
        $store.commit('hideLoading');
        return Promise.reject(error);
    }
);
*/
