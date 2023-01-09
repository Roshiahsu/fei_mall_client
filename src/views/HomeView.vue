<template>
  <div class="home">
    <el-container>
      <el-header class="layout-header">
          <img src="/au.png"
               style="width: 150px;display:block; margin:0 auto; "alt="">
          <div style="width: 1200px;margin:0 auto; background-color: #42b983">
              <span style="position: absolute;left:38%">
                  <a href="/index">首頁</a><el-divider direction="vertical"></el-divider>
                  <a href="/product/list?page=1">商品介紹</a><el-divider direction="vertical"></el-divider>
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
          <el-aside class="layout-side" width="200px">
              預計放置搜索匡與關鍵字快捷

              <!--TODO 根據權限是否為admin顯現 開始-->
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
                      <el-menu-item index="/admin/brand/list" class="el-icon-first-aid-kit" >商品列表</el-menu-item>
                      <el-menu-item index="/admin/brand/addNew" class="el-icon-first-aid-kit">新增商品</el-menu-item>
                  </el-submenu>
                  <!--商品管理結束-->

                  <!--品牌管理開始-->
                  <el-submenu index="2">
                      <template slot="title">
                          <i class="el-icon-first-aid-kit"></i>
                          <span>品牌管理</span>
                      </template>
                      <el-menu-item index="/brand/addNew" class="el-icon-first-aid-kit">新增品牌</el-menu-item>
                  </el-submenu>
                  <!--品牌管理結束-->

                  <!--類別管理開始-->
                  <el-submenu index="3">
                      <template slot="title">
                          <i class="el-icon-tickets"></i>
                          <span>類別管理(待完成)</span>
                      </template>
                      <el-menu-item index="/category/addNew" class="el-icon-tickets">新增類別</el-menu-item>
                  </el-submenu>
                  <!--類別管理結束-->
              </el-menu>
              <!--TODO 根據權限是否為admin顯現 結束-->

          </el-aside>
        <el-main>
          <!--主體-->
          <router-view/>
        </el-main>

          <!--        右邊欄位-->
          <el-aside class="layout-side" width="200px">
             先空出來

          </el-aside>

      </el-container>
    </el-container>

  </div>
</template>

<script>
 export default {
    data() {
        return {
            jwt:"",
            role: '' //角色設定(未完成)
        };
    },
    methods: {
        //登出
        logout(){
            localStorage.clear()
            location.href = "/"
        },
        //解析jwt
        parseJwt(jwt){
            if(jwt!==null){
                //jwt分段
                let strings = this.jwt.split(".")
                //分析payload
                let jsonResult = JSON.parse(decodeURIComponent(escape
                (window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")))));
                console.log(jsonResult)
                //將解析後的jsonResult.user從JSON格式還原
                var userInfo =JSON.parse(jsonResult.user)
                this.role=userInfo.authorities[0]
                console.log("role",this.role)
            }
        }
    },
    created() {

    },
    mounted() {
        this.jwt=localStorage.getItem("jwt")
        this.parseJwt(this.jwt)
    }
}
</script>
<style>

    *{
        /*歸零body自帶外邊距*/
        margin: 0;
    }

    .layout-body{
        position: absolute;
        top:150px;
        right: 0;
        left: 0;
        bottom: 0;
    }

    /*側邊欄背景顏色*/
    .el-aside{
        background-color: #ecaf94;
    }

    body{
        font: 18px "Microsoft YaHei UI";
        margin: 0;
    }
    header a{
        text-decoration: none;
        color: #6c6c6c;
    }
    header a:hover{
        color: #0aa1ed;
    }

</style>
