import router from './router'
import store from './store'
import { menusToRoutes, resetTokenAndClearUser } from './utils'
import myStorage from 'utils/localstore'
import VueCookies from 'vue-cookies' 
import { LoadingBar } from 'view-design'
import axios from 'axios'

// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    LoadingBar.start()
    if (VueCookies.get('fdp-token')) {
        if (to.path === '/login') {
            // next({path: '/'})  // 重定向要主页
            next({name: from.name ? from.name : '/'})
        } else {
            if (hasMenus) {
                next()
            } else {
                try {
                    // 这里可以用 await 配合请求后台数据来生成路由
                    // const data = await axios.get('xxx')
                    // const routes = menusToRoutes(data)
                    let menus = []
                    const { role } = myStorage.get('fdp-userData')
                    console.log(role)
                    if(role && role.roleId ===  3) {
                        menus = [
                              {
                                name: 'data-report', // 要跳转的路由名称 不是路径
                                text: '检验结果', // 文本内容
                                type: 'md-list', // 图标
                                size: 22 // 图标大小
                              },
                              {
                                name: 'inspect-detail',
                                text: '检验详情',
                                hidden: true
                              },
                              {
                                name: 'device-manage', // 要跳转的路由名称 不是路径
                                text: '设备管理', // 文本内容
                                type: 'ios-settings', // 图标
                                size: 22 // 图标大小
                              },
                              {
                                name: 'standard-inspec', // 要跳转的路由名称 不是路径
                                text: '检验标准', // 文本内容
                                type: 'ios-contrast', // 图标
                                size: 22 // 图标大小
                              },
                              {
                                name: 'category-list', // 要跳转的路由名称 不是路径
                                text: '品类列表', // 文本内容
                                hidden: true
                              },
                              {
                                name: 'category-detail', // 要跳转的路由名称 不是路径
                                text: '品类详情', // 文本内容
                                hidden: true
                              },
                              {
                                name: 'account-manage',
                                text: '账号管理',
                                type: 'md-people',
                                size: 22
                              }
                        ]
                    }else if(role && role.roleId ===  4){
                        menus = [
                            {
                                name: 'data-manage', // 要跳转的路由名称 不是路径
                                text: '数据管理', // 文本内容
                                type: 'md-pie', // 图标
                                size: 22 // 图标大小
                            },
                            {
                                name: 'inspect-detail',
                                text: '检验详情',
                                hidden: true
                            },
                            {
                                name: 'device-report', // 要跳转的路由名称 不是路径
                                text: '设备报告管理', // 文本内容
                                type: 'ios-settings', // 图标
                                size: 22 // 图标大小
                            },
                            {
                                name: 'data-report', // 要跳转的路由名称 不是路径
                                text: '检验结果', // 文本内容
                                type: 'md-list', // 图标
                                size: 22 // 图标大小
                            },
                      ]
                    }
                    store.commit('setMenus',menus)
                    const routes = menusToRoutes(store.state.menuItems)
                    // 动态添加路由
                    router.addRoutes(routes)
                    hasMenus = true
                    console.log(to.path,"to.path")
                    next({path: to.path || '/'})
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})