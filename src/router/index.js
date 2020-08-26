import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('views/login/login.vue')
    }
] 



// 需要动态生成路由
export const asyncRoutes = {
    // 数据管理
    'data-manage': {
        path: 'dataManage',
        name: 'data-manage',
        component: () => import('views/dataManage/dataManage.vue'),
        meta: {title: '数据管理',breadNumber: 1}  // 设置面包屑等级
    },

     // 数据报告管理
     'data-report': {
        path: 'dataReport',
        name: 'data-report',
        component: () => import('views/dataReport/dataReport.vue'),
        meta: {title: '检验结果',breadNumber: 1}  // 设置面包屑等级
    },

    // 检验详情
    'inspect-detail': {
        path: 'inspectDetail/:paramObj',
        name: 'inspect-detail',
        component: () => import('views/inspectDetail/inspectDetail.vue'),
        meta: {title: '检验详情',breadNumber: 2}
    },

    // 设备管理
    'device-manage': {
        path: 'deviceManage',
        name: 'device-manage',
        component: () => import('views/deviceManage/deviceManage.vue'),
        meta: {title: '设备管理',breadNumber: 1}  // 设置面包屑等级
    },

    // 设备报告管理
    'device-report': {
        path: 'deviceReport',
        name: 'device-report',
        component: () => import('views/deviceReport/deviceReport.vue'),
        meta: {title: '设备报告管理',breadNumber: 1}  // 设置面包屑等级
    },

    // 检验标准
    'standard-inspec': {
        path: 'standardInspec',
        name: 'standard-inspec',
        component: () => import('views/standardInspec/standardInspec.vue'),
        meta: {title: '检验标准',breadNumber: 1}
    },

    // 品类列表
    'category-list': {
        path: 'categoryList/:paramObj',
        name: 'category-list',
        component: () => import('views/standardInspec/categoryList.vue'),
        meta: {title: '品类列表',breadNumber: 2}
    },

    // 品类详情
    'category-detail': {
        path: 'categoryDetail/:paramObj',
        name: 'category-detail',
        component: () => import('views/standardInspec/categoryDetail.vue'),
        meta: {title: '品类详情',breadNumber: 3}
    },

    // 账号管理
    'account-manage': {
        path: 'accountManage',
        name: 'account-manage',
        component: () => import('views/accountManage/accountManage.vue'),
        meta: {title: '账号管理',breadNumber: 1}
    }
}

const createRouter = () => new Router({
    routes: commonRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher 
}

export default router