// import axios from 'axios'
// import {getUrl} from '@/utils/Utils'
//
// const userRequest = axios.create({
//     baseURL: getUrl()
// });
//
// export const apiUserLogin = data => userRequest.get('/keyword/', data);

import {getUrl} from '@/utils/Utils'
import request from '@/utils/request'

export function getRequest(url) {
    return request({
        url:getUrl()+url,
        method:'get',
    })
}

export function postRequest(url,data) {
    return request({
        url:getUrl()+url,
        method:'post',
        data:data,
    })
}
