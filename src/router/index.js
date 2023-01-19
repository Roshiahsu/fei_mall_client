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
        //待完成
        path: 'user/update',
        component: () => import('../views/user/UserDetailUpdateView.vue'),
      },
      {
        path: 'brand/addNew',
        name:'新增品牌',
        component: () => import('../views/brand/BrandAddNewView'),
        children: [
          {
            path: 'list',
            name:'品牌列表',
            component: () => import('../views/brand/BrandListView')
          },
        ]
      },
      {
        path: 'category/addNew',
        name: '新增類別',
        component: () => import('../views/category/CategoryAddNewView'),
        children: [
          {
            path: '/list',
            name: '新增列表',
            component: () => import('../views/category/CategoryListView')
          },
        ]
      },

      {
        path: 'product/addNew',
        component: () => import('../views/product/ProductAddNewView.vue')
      },
      {
        path: 'product/list',
        name:'商品介紹',
        component: () => import('../views/product/ProductListView.vue')
      },
      {
        path: '/product/admin/list',
        name:'商品介紹(管理員)',
        component: () => import('../views/product/ProductListForAdminView')
      },
      {
        path: 'product/details',
        name:'商品詳情',
        component: () => import('../views/product/ProductDetailView.vue')
      },
      {
        path: 'product/update',
        name:'修改商品詳情',
        component: () => import('../views/product/ProductUpdateView.vue')
      },
      {
        path: 'cart/list',
        name:'購物車列表',
        component: () => import('../views/cart/CartListView')
      },
      {
        path: 'order/list',
        name:'訂單列表',
        component: () => import('../views/order/OrderListView')
      },
      {
        path: 'order/success',
        name:'訂單完成',
        component: () => import('../views/order/OrderSuccessView'),
        children:[
          {
            path: 'orderDetailInfo',
            name:'訂單詳情2',
            component: () => import('../views/order/OrderDetailInfoView')
          },
        ],
      },
      {
        path: 'orderDetailInfo',
        name:'訂單詳情',
        component: () => import('../views/order/OrderDetailInfoView')
      },
      {
        path: 'customerCenter',
        name:'顧客中心',
        component: () => import('../views/user/UserDetailView')
      },
      {
        path: 'search',
        name:'商品搜尋',
        component: () => import('../views/search/SearchListView')
      },
      {
        path: 'index',
        component: () => import('../views/Index')
      }
    ],
  },
  {
    /*配置/login*/
    path: '/login',
    /*name 可要可不要，作用在於辨識*/
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
    document.title=to.meta.title ? to.meta.title:"澳洲代購";
  next();
})

export default router
