import { asyncRoutes, resetRouter } from '../router'
import myStorage from './localstore'
import VueCookies from 'vue-cookies' 
import store from '../store'

/**
 * push子路由
 * @param {Array} children  子路由
 * @param {Object} item  store里的左菜单栏的每个对象
 */
function generateRoutes(children, item) {
    if (item.name) {
        children.push(asyncRoutes[item.name])
    } else if (item.children) {
        item.children.forEach(e => {
            generateRoutes(children, e)
        })
    }
}

/**
 * 将左侧菜单信息转成对应的路由信息 动态添加
 * @param {Array} data   store里面存储的左侧菜单栏数据
 */
export function menusToRoutes(data) {
    const result = []  // 父级路由
    const children = []  // 子路由映射

    result.push({
        path: '/',
        component: () => import('@/layout/index.vue'),
        // redirect: '/dataManage',
        redirect: {name:store.getters.initMenus},
        children,
    })

    data.forEach(item => {
        generateRoutes(children, item)
    })

    children.push({
        path: 'error',
        name: 'error',
        component: () => import('@/views/error/error.vue')
    })

    // 最后添加404页面 否则会在登陆成功后跳到404页面
    result.push(
        {path: '*', redirect: '/error'},
    )

    return result
}



export function resetTokenAndClearUser() {
    // 退出登陆 清除用户资料
    console.log('清除用户资料')
    myStorage.clear()
    VueCookies.remove('fdp-token')
    VueCookies.remove('token')
    store.commit('setUserData','')
    store.commit('setMenus',[])
    // 重设路由
    resetRouter()
}