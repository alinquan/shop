import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

import '@/assets/css/reset.css'
import extend from './support/extensions'; // API 通用方法


// vant 完全引入
/*import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);*/

// 按需引入vant 推荐
import {
    SubmitBar,
    Card,
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn,
    PullRefresh,
    List,
    Row,
    Col,
    Toast,
    CellGroup,
    Field,
    Tab,
    Tabs,
    Button,
    Icon,
    NavBar,
    Tabbar,
    TabbarItem,
    Swipe,
    SwipeItem,
    Lazyload
} from 'vant'

Vue.use(SubmitBar).use(Card).use(GoodsAction).use(GoodsActionBigBtn).use(GoodsActionMiniBtn).use(PullRefresh).use(List).use(Row).use(Col).use(Toast).use(CellGroup).use(Field).use(Tab).use(Tabs).use(Button).use(Icon).use(NavBar).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem).use(Lazyload)

import '@/mock/mock.js';

Object.assign(Vue.prototype, extend);
import global from './support/global';

global.init(extend);
global.loginStatusCheck(() => {
    window.$app = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');

    /* router.afterEach((to, from) => {
       document.title = titles[to.name] || '';
     });*/
});

