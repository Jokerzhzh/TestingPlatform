import axios from 'axios'; //引入axios
import store from '../store';
import router from '../router';
export const baseUrl = process.env.VUE_APP_URL; // 引入全局url，定义在全局变量process.env中

// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//创建axios实例，请求超时时间为300秒
const instance = axios.create({
    timeout: 300000
});

//请求和响应拦截可以根据实际项目需求进行编写
// 请求发起前拦截
// instance.interceptors.request.use(
//     config => {
//         let token = store.state.token; // 获取token
//         // let token = localStorage.getItem('token');
//         // let token = "47f46f20-3e1e-4a4a-86a4-1bcc0acfa1a2"
//         if (token && token != null) {
//             config.headers['Authorization'] = token; // 如果token存在 且不为null，则传token给后台
//         } else {
//             // console.log('无token')
//             //跳转登录设置
//             // setTimeout(() => {
//             //     router.replace({
//             //         path: '/login'
//             //     });
//             // }, 1000);
//         }
//         // console.log("请求拦截",config);
//         return config;
//     },
//     error => {
//         // Do something with request error
//         return Promise.reject(error);
//     }
// );

// 响应拦截（请求返回后拦截）
instance.interceptors.response.use(
    response => {
        if (response.status != 200) {
            // console.log('跳转404页面');
            setTimeout(() => {
                router.replace({
                    path: '/404'
                });
            }, 1000);
        } else {
            return response.data;
        }
    },
    error => {
        switch (error.response.status) {
            case 401:
                // console.log('未登录，跳转登录页')
                setTimeout(() => {
                    router.replace({
                        path: '/login'
                    });
                }, 1000);
                break;
            case 403:
                // console.log('token过期跳转登录')
                // Vue.prototype.$message.error('token失效请重新登录！');
                setTimeout(() => {
                    router.replace({
                        path: '/login'
                    });
                }, 1000);
                break;
            // 404请求不存在
            case 404:
                // console.log('404请求不存在')
                setTimeout(() => {
                    router.replace({
                        path: '/404'
                    });
                }, 1000);
                break;
            // 其他错误，直接抛出错误提示
            default:
        }
        // return Promise.reject(error.response);
        return Promise.reject(error);
    }
);

//按照请求类型对axios进行封装
const api = {
    get(url, data) {
        return instance.get(baseUrl + url, { params: data });
    },
    post(url, data) {
        return instance.post(baseUrl + url, data);
    },
    delete(url, data) {
        return instance.delete(baseUrl + url, { data });
    },
    put(url, data) {
        return instance.put(baseUrl + url, data);
    }
};
export { api };
