import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    /*配置/home*/
    path: '/',
    name: 'home',
    component: HomeView,
    /*重定向，剛訪問就直接預設訪問頁面*/
    redirect:'/index',
    /*因為作用頁面在HomeView底下，所以必須把要實現的頁面放到這裡面成為子項目
    * 添加children 並用 陣列方式呈現*/
    children:[
      {
        path: 'user/list',
        component: () => import('../views/user/UserListView.vue'),
        meta:{
          title:'酷鯊商城運營管理平台-用戶列表模塊'
        }
      },
      {
        path: 'user/add-new',
        component: () => import('../views/user/UserAddNewView.vue'),
        meta:{
          title:'酷鯊商城運營管理平台-新增用戶模塊'
        }
      },
      {
        path: 'admin/list',
        component: () => import('../views/admin/AdminListView.vue'),
        meta:{
          title:'酷鯊商城運營管理平台-管理員列表模塊'
        }
      },
      {
        path: 'admin/add-new',
        component: () => import('../views/admin/AdminAddNewView.vue'),
        meta:{
          title:'酷鯊商城運營管理平台-新增管理員列表模塊'
        }
      },
      {
        path: 'brand/list',
        component: () => import('../views/brand/BrandListView')
      },
      {
        path: 'brand/add-new',
        component: () => import('../views/brand/BrandAddNewView')
      },
      {
        path: 'category/add-new',
        component: () => import('../views/category/CategoryAddNewView')
      },
      {
        path: 'category/list',
        component: () => import('../views/category/CategoryListView')
      },
      {
        path: '/index',
        component: () => import('../views/Index')
      }
    ]
  },
  // {
  //   /*配置/login*/
  //   path: '/',
  //   /*name 可要可不要，作用在於辨識*/
  //   name: 'login',
  //   component: () => import('../views/Index.vue')
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
    document.title=to.meta.title ? to.meta.title:"酷鯊商城運營管理平台";
  next();
})

export default router
