import Vue from 'vue';
import App from './App.vue';
import router from './router';
import methods from './utils/methods';
import store from './store';
import './assets/css/element.css'; // 默认主题
import 'default-passive-events';
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import api from './api/api';
// json 转 xml
import x2js from 'x2js';
import tesReport from './api/tesReport';
// 引入echarts
import echarts from './utils/echartsUi';
// import 'echarts-liquidfill';

// 引入抽奖大转盘九宫格
import LuckDraw from "vue-luck-draw";
Vue.use(LuckDraw);

Vue.prototype.$echarts = echarts;
// 将公共方法挂载到vue原型上123
Vue.prototype.$methods = methods;
// 封装json转xml
Vue.prototype.$x2js = new x2js();
//将封装的接口挂载到vue原型上
Vue.prototype.$api = api;
Vue.prototype.$tesReport = tesReport;
Vue.config.productionTip = false;
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    // document.title = `${to.meta.title} | vue-manage-system`;
    document.title = `${to.meta.title}`;
    // const role = localStorage.getItem('token');
    const role = store.state.token; // 获取token
    if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
