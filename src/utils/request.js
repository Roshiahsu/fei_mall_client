import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000
})

// request攔截器
service.interceptors.request.use(config => {
    return config
}, error => {
    console.error("request error",error) // for debug
    Promise.reject(error)
})


// response攔截器
service.interceptors.response.use(
    response => {
        if (response.data.serviceCode === 20000) {
            return response.data
        } else{
            console.log("response錯誤")
            return response.data
        }
    },
    error => {
        console.log("response攔截器error")
    }
)
export default service

