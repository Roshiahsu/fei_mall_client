import axios from 'axios'
import {reLogin} from "@/utils/Utils";
import {getCookie} from '@/utils/support';

const Token = 'Authorization'
const jwt = localStorage.getItem('jwt')

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000
})

// request攔截器
service.interceptors.request.use(config => {
    if(jwt){
        console.log("從cookie中獲取到jwt")
        config.headers[Token] = jwt
    }
    return config
}, error => {
    console.error("request error",error) // for debug
    Promise.reject(error)
})


// response攔截器
service.interceptors.response.use(
    response => {
        console.log("response",response)
        if (response.data.serviceCode === 20000) {
            return response.data
        }else if(response.data.serviceCode === 40001
            || response.data.serviceCode === 40004){
            reLogin()
            return response.data
        } else{
            console.log("response錯誤>>>",response.data)
            return response.data
        }
    },
    error => {
        console.log("response攔截器error")
    }
)
export default service

