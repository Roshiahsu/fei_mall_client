<template>
  <div class="home">
    <el-container>
      <el-header class="layout-header">
          <img src="/au.png"
               style="width: 150px;display:block; margin:0 auto; "alt="">
          <div style="width: 1200px;margin:0 auto; background-color: #42b983">
              <span style="position: absolute;left:37%">
                  <a href="/index">首頁</a><el-divider direction="vertical"></el-divider>
                  <a href="/product/list?pageNum=1&pageSize=3">商品介紹</a><el-divider direction="vertical"></el-divider>
                  <a href="">購物車</a><el-divider direction="vertical"></el-divider>
                  <a href="">顧客中心</a><el-divider direction="vertical"></el-divider>
                  <a href="/login">會員登入</a>
              </span>
          </div>
          <el-divider></el-divider>

      </el-header>

      <el-container class="layout-body">
          <el-aside class="layout-side" width="200px">
              <!--TODO 根據權限是否為admin顯現 開始-->
              <el-menu
                      v-if="aa === 1"
                      router
                      :default-active=this.$router.currentRoute.path
                      class="el-menu-vertical-demo"
              >
                  <!--用戶管理開始-->
                  <el-submenu index="1">
                      <template slot="title">
                          <i class="el-icon-user"></i>
                          <span>用戶管理</span>
                      </template>
                      <!--直接修改index的值，為業務路徑-->
                      <el-menu-item index="/user/list" class="el-icon-user" >用戶列表</el-menu-item>
                  </el-submenu>
                  <!--用戶管理結束-->

                  <!--管理員管理開始-->
                  <el-submenu index="2">
                      <template slot="title">
                          <i class="el-icon-user"></i>
                          <span>管理員管理</span>
                      </template>
                      <!--直接修改index的值，為業務路徑-->
                      <el-menu-item index="/admin/admin/list" class="el-icon-user" >管理員列表</el-menu-item>
                      <el-menu-item index="/admin/admin/add-new" class="el-icon-user">新增管理員</el-menu-item>
                  </el-submenu>
                  <!--管理員管理結束-->

                  <!--商品管理開始-->
                  <el-submenu index="3">
                      <template slot="title">
                          <i class="el-icon-first-aid-kit"></i>
                          <span>商品管理</span>
                      </template>
                      <el-menu-item index="/admin/brand/list" class="el-icon-first-aid-kit" >商品列表</el-menu-item>
                      <el-menu-item index="/admin/brand/add-new" class="el-icon-first-aid-kit">新增商品</el-menu-item>
                  </el-submenu>
                  <!--商品管理結束-->

                  <!--品牌管理開始-->
                  <el-submenu index="4">
                      <template slot="title">
                          <i class="el-icon-first-aid-kit"></i>
                          <span>品牌管理</span>
                      </template>
                      <el-menu-item index="/admin/brand/list" class="el-icon-first-aid-kit" >品牌列表</el-menu-item>
                      <el-menu-item index="/admin/brand/add-new" class="el-icon-first-aid-kit">新增品牌</el-menu-item>
                  </el-submenu>
                  <!--品牌管理結束-->

                  <!--類別管理開始-->
                  <el-submenu index="5">
                      <template slot="title">
                          <i class="el-icon-tickets"></i>
                          <span>類別管理</span>
                      </template>
                      <el-menu-item index="/admin/category/list" class="el-icon-tickets" >類別列表</el-menu-item>
                      <el-menu-item index="/admin/category/add-new" class="el-icon-tickets">新增類別</el-menu-item>
                  </el-submenu>
                  <!--類別管理結束-->
              </el-menu>
              <!--TODO 根據權限是否為admin顯現 結束-->

          </el-aside>
        <el-main>
          <!--主體-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
  /*body自帶外邊距*/
  *{
    margin: 0;
  }
  .layout-header{
    color: #0c4f89;
  }
  .layout-body{
    position: absolute;
    top:150px;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .el-aside{
    background-color: #ecaf94;
  }

</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
    data() {
        return {
            tableData:[]
        };
    },
    methods: {
        loadAdmins(){
            //自動獲取
            let url="http://localhost:9080/user/userInfo"
            this.axios.get(url).then((response)=>{
                let json=response.data
                if(json.serviceCode===20000){
                    this.tableData=json.data;
                }else{
                    this.$message.error(json.message)
                }
                console.log(this.tableData)
            })
        },
    },
    created() {

    },
    mounted() {
        this.loadAdmins();
    }
}
</script>
