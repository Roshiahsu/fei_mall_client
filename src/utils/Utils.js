import {MessageBox, Message} from 'element-ui'
import VueRouter from "vue-router";

export function getUrl() {
    let url = "http://localhost:9080"
    return url;
}

export function reLogin() {
    MessageBox.alert('用戶尚未入，請先登入？', '尚未登入', {
        confirmButtonText: '確定',
        callback: action => {
            location.href = "/login"
        }
    })
}

export function haveJwt(jwt) {
    if (jwt === null) {
        console.log("沒有jwt準備跳轉")
        reLogin()
        return
    }
}

// module.exports = getUrl;