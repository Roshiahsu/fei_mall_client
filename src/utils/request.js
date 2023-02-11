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


// respone攔截器
axios.interceptors.response.use(
    response => {
        if (response.data.serviceCode === 20000) {
            console.log("oops")
            return response
        } else if (response.data.serviceCode === 59999){
            console.log("ＱＱ")
            return Promise.reject(response)
        }
    },
    error => {
        console.log("ＱＱ")
        return Promise.reject(error)
    }
)
export default service

