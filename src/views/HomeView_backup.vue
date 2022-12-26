<template>
  <div class="home">
    <el-container>
      <el-header class="layout-header">
          頭
      </el-header>

      <el-container class="layout-body">
        <el-aside class="layout-side" width="200px">
          <!--添加router 屬性開啟跳轉功能 默認為false-->
          <el-menu
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
                <el-menu-item index="/admin/user/list" class="el-icon-user" >用戶列表</el-menu-item>
                <el-menu-item index="/admin/user/add-new" class="el-icon-user">新增用戶</el-menu-item>
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
                <span>品牌管理</span>
              </template>
              <el-menu-item index="/admin/brand/list" class="el-icon-first-aid-kit" >品牌列表</el-menu-item>
              <el-menu-item index="/admin/brand/add-new" class="el-icon-first-aid-kit">新增品牌</el-menu-item>
            </el-submenu>
            <!--商品管理結束-->

            <!--類別管理開始-->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>類別管理</span>
              </template>
              <el-menu-item index="/admin/category/list" class="el-icon-tickets" >類別列表</el-menu-item>
              <el-menu-item index="/admin/category/add-new" class="el-icon-tickets">新增類別</el-menu-item>
            </el-submenu>
            <!--類別管理結束-->
          </el-menu>

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
    background-color: #42b983;
    color: #2c3e50;
  }
  .layout-body{
    position: absolute;
    top:60px;
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
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
