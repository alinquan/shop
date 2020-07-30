import Vue from 'vue'
import Vuex from 'vuex'
import {Toast} from 'vant';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {},
        loading: null,
        loadingNum: 0,
        winWidth: 375, // 默认屏幕宽度375px
        designRem: 25, // 默认全屏 25rem
    },
    getters: {},
    mutations: {
        changeLogin(state, status) {
            state.userInfo = status;
        },
        updateWinWidth(state, winWidth) {
            state.winWidth = winWidth;
        },
        showLoading(state, title = '加载中') {
            state.loadingNum += 1;
            state.loading = Toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'circular',
                // loadingType: 'spinner',
                message: title
            });
        },
        hideLoading(state) {
            state.loadingNum -= 1;
            if (state.loadingNum === 0) {
                state.loading && state.loading.clear()
            }
        },
        updateTitle(state, titleTxt) {
            document.title = titleTxt;
        },
    },
    actions: {
        loginAction({commit}, user) {
            commit('changeLogin', user);
        }
    }
})

