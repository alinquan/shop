
"use strict";

// 有子路由的页面都需要引入这个文件

// 判断当前组件是否是数组中的最后一项
function isLastItem(item, arr) {
    return arr.indexOf(item) > -1 && arr[arr.length - 1] === item;
}
// 获取当前组件的名称
function getComponentName(tag) {
    if (tag) {
        // 通过正则获取当前组件对应的路由名称
        let res = tag.match(/vue-component-[\d]*-(\S+\/?)$/);
        return res && res[1] ? res[1] : '';
    }
    return ''
}
function getPathArr(path) {
    return path.split('/').filter(item => item)
}
function getPathStep(path, pathArr) {
    let index = pathArr.indexOf(path);
    return index === -1 ? -1 : (pathArr.length - index);
}

export default {
    data() {
        return {
            isShowChildView: false,
        }
    },
    watch: {
        "$route.fullPath" (n, o) {
            // console.log(getComponentName(this.$vnode.tag), n, o);
            this.checkRouter(n, o);
        }
    },
    // beforeRouteUpdate(to, from, next) {
        // console.warn("------------ ------------");
        // this.checkRouter(to, from);
        // console.log("isShowChildView: ", this.isShowChildView);
        // next();
    // },
    mounted() {
        // 看是否显示子路由
        this.checkShowChild();
    },
    methods: {
        checkShowChild() {
            let name = getComponentName(this.$vnode.tag);
            if (name) {
                console.log("mounted", name)
                let arr = getPathArr(this.$route.fullPath);
                this.isShowChildView = arr.indexOf(name) > -1 && arr[arr.length - 1] != name;
            }
        },
        // checkRouter(to, from) {
        checkRouter(to, from) {
            // let toArr = getPathArr(to.fullPath);
            // let fromArr = getPathArr(from.fullPath);
            let toArr = getPathArr(to);
            let fromArr = getPathArr(from);
            console.log("this.$vnode.tag");
            console.log(this.$vnode.tag);
            let name = getComponentName(this.$vnode.tag);
            // console.log(name, toArr.join('/'), fromArr.join('/'), window.location.hash);
            // console.log(1)
            if(isLastItem(name, toArr) || isLastItem(name, fromArr)) {
                // console.log(2)
                this.isShowChildView = toArr.length && (!fromArr.length || toArr.length > fromArr.length);
            } else if(toArr.indexOf(name) > -1 && fromArr.indexOf(name) > -1) {
                // console.log(3)
                this.isShowChildView = true;
            } else {
                // console.log(4)
                this.isShowChildView = false;
            }

        }
    }
}
