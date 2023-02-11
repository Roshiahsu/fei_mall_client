<template>
    <div class="home">
        <el-container>
            <el-header class="layout-header">
                <img src="/au.png"
                     style="width: 100px;display:block; margin:0 auto; " alt="">
                <div style="width: 1200px;margin:0 auto; background-color: #42b983">
              <span style="position: absolute;left:38%">
                  <a href="/index">首頁</a><el-divider direction="vertical"></el-divider>
                  <a href="/product/list">商品介紹</a><el-divider direction="vertical"></el-divider>
                  <a href="/cart/list">購物車</a><el-divider direction="vertical"></el-divider>
                  <a href="/customerCenter">顧客中心</a><el-divider direction="vertical"></el-divider>

                  <a href="javascript:void(0)" v-if="jwt" @click="logout()">會員登出</a>
                                    <a href="/login" v-else>會員登入</a>
              </span>
                </div>
                <el-divider></el-divider>

            </el-header>

            <el-container class="layout-body">
                <!--        左邊欄位-->
                <el-aside class="layout-side" :width="elAsideWidth">


                    <!-- 根據權限是否為admin顯現 開始-->
                    <el-menu
                            v-if="role === 'ROLE_admin'"
                            router
                            :default-active=this.$router.currentRoute.path
                            class="el-menu-vertical-demo"
                    >
                        <!--商品管理開始-->
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-first-aid-kit"></i>
                                <span>商品管理</span>
                            </template>
                            <el-menu-item index="/product/admin/list" class="el-icon-first-aid-kit">商品列表</el-menu-item>
                            <el-menu-item index="/product/addNew" class="el-icon-first-aid-kit">新增商品</el-menu-item>
                        </el-submenu>
                        <!--商品管理結束-->

                        <!--品牌管理開始-->
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-first-aid-kit"></i>
                                <span>品牌管理</span>
                            </template>
                            <el-menu-item index="/brand/addNew/list" class="el-icon-first-aid-kit">新增品牌</el-menu-item>
                        </el-submenu>
                        <!--品牌管理結束-->

                        <!--訂單管理開始-->
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-tickets"></i>
                                <span>訂單管理</span>
                            </template>
                            <el-menu-item index="/order/admin/list" class="el-icon-tickets">訂單列表</el-menu-item>
                        </el-submenu>
                        <!--訂單管理結束-->
                    </el-menu>
                    <!-- 根據權限是否為admin顯現 結束-->
                    <div style="margin-top: 30px;">
                        <el-input size="small" style="width: 140px;left: 8px" v-model="keyword" placeholder="全站搜索"
                                  clearable></el-input>
                        <el-button type="primary" @click="search(keyword)"
                                   icon="el-icon-search" size="small"
                                   style="position: relative;left:10px"></el-button>

                    </div>
                    <el-divider></el-divider>
                    <div class="parent">
                        <h3>熱門搜索</h3>
                        <div>
                        <span v-for=" keyword in keywordArr" :key="keyword">
                     <a href="javascript:void(0)" @click="search(keyword)">{{keyword}}</a><el-divider
                                direction="vertical"></el-divider>
                 </span>
                        </div>

                    </div>
                </el-aside>
                <el-main>
                    <!--主體-->
                    <router-view/>
                </el-main>

                <!--        右邊欄位-->
                <el-aside class="layout-side" :width="elAsideWidth">


                </el-aside>

            </el-container>
        </el-container>

    </div>
</template>

<script>
    import {getUrl} from '@/utils/Utils';
    import {getList} from "@/utils/api";
    export default {
        data() {
            return {
                jwt: "",
                role: '',
                keyword: '',
                keywordArr: [],
                url: getUrl(),
                elAsideWidth: "200px",
            };
        },
        methods: {
            //登出
            logout() {
                localStorage.clear()
                location.href = "/"
            },
            //解析jwt
            parseJwt(jwt) {
                if (jwt !== null) {
                    //jwt分段
                    let strings = this.jwt.split(".")
                    //分析payload
                    let jsonResult = JSON.parse(decodeURIComponent(
                        escape(window.atob(strings[1]
                            .replace(/-/g, "+")
                            .replace(/_/g, "/")))));
                    console.log("解析過的jwt", jsonResult)
                    //將解析後的jsonResult.user從JSON格式還原
                    var userInfo = JSON.parse(jsonResult.user)
                    //獲取權限
                    this.role = userInfo.authorities[0]
                    console.log("role", this.role)
                    return jsonResult.exp
                }
            },
            //搜尋頁面
            search(keyword) {
                location.href = "/search?keyword=" + keyword
            },
            //獲取關鍵字
            loadKeyword() {
                getList("/keyword/").then(response=>{
                    let json=response.data
                    this.keywordArr = json.data
                });
            },
            isExpired(jwt) {
                let exp = this.parseJwt(jwt);
                console.log("解析過的exp", exp)
                //當前時間大於exp則將用戶登出
                if (Date.now() / 1000 > exp) {
                    this.logout()
                }
            }
        },
        created() {
            this.jwt = localStorage.getItem("jwt")
            this.isExpired(this.jwt)
            this.loadKeyword()
        },
        mounted() {

        }
    }
</script>
<style>

    * {
        /*歸零body自帶外邊距*/
        margin: 0;
    }

    .layout-body {
        position: absolute;
        top: 120px;
        right: 0;
        left: 0;
        bottom: 0;

    }

    /*側邊欄背景顏色*/
    .el-aside {
        background-color: rgba(156, 158, 142, 0.52);
        /*background-color: #ecaf94;*/

    }

    body {
        font: 18px "Microsoft YaHei UI";
        margin: 0;
    }

    a {
        text-decoration: none;
        color: #6c6c6c;
    }

    header a:hover {
        color: #0aa1ed;
    }

    .parent {
        display: flex;
        /* 水平置中 */
        justify-content: center;
        /* 垂直置中 */
        align-content: center;
        flex-wrap: wrap;
    }

</style>
