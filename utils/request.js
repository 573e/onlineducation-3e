import axios from 'axios';
import cookie from "js-cookie";
import { MessageBox, Message } from 'element-ui';

// 创建 axios 对象
const service = axios.create({
    baseURL: 'http://localhost:9001',
    timeout: 20000
})

// cookie token 拦截器
// 每次请求中使用此拦截器
service.interceptors.request.use(
    config => {
        if (cookie.get('3e_token')) {
            // 将 token 值放到 header 中
            config.headers['token'] = cookie.get('3e_token');
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

// http response 拦截器
service.interceptors.response.use(
    response => {
        //debugger
        if (response.data.code == 28004) {
            console.log("response.data.resultCode是28004")
            // 返回 错误代码-1 清除ticket信息并跳转到登录页面
            //debugger
            window.location.href = "/login"
            return
        } else {
            if (response.data.code !== 20000) {
                //25000：订单支付中，不做任何提示
                if (response.data.code != 25000) {
                    Message({
                        message: response.data.message || 'error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            } else {
                return response;
            }
        }
    },
    error => {
        return Promise.reject(error.response)   // 返回接口返回的错误信息
    });


export default service