
import router from '../router.js';
import titles from '../support/routeTitle.js';

const whiteList = ['/login']; // 不重定向白名单

// console.log(router.options.routes);
//
router.beforeEach((to, from, next) => {
    // document.title = to.meta.name;
    console.log("route each -> to: ", to);
    if (localStorage.getItem('token')) {
        if (to.path === '/login') {
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next();
        }
    }
});
