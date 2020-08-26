import Vue from 'vue'
import Vuex from 'vuex'
import myStorage from 'utils/localstore'
import login from './modules/login'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 左侧菜单栏数据
    // menuItems: [
    //   {
    //     name: 'data-manage', // 要跳转的路由名称 不是路径
    //     text: '数据管理', // 文本内容
    //     type: 'md-pie', // 图标
    //     size: 22 // 图标大小
    //   },
    //   {
    //     name: 'data-report', // 要跳转的路由名称 不是路径
    //     text: '数据报告管理', // 文本内容
    //     type: 'md-pie', // 图标
    //     size: 22 // 图标大小
    //   },
    //   {
    //     name: 'inspect-detail',
    //     text: '检验详情',
    //     hidden: true
    //   },
    //   {
    //     name: 'device-manage', // 要跳转的路由名称 不是路径
    //     text: '设备管理', // 文本内容
    //     type: 'ios-settings', // 图标
    //     size: 22 // 图标大小
    //   },
    //   {
    //     name: 'device-report', // 要跳转的路由名称 不是路径
    //     text: '设备报告管理', // 文本内容
    //     type: 'ios-settings', // 图标
    //     size: 22 // 图标大小
    //   },
    //   {
    //     name: 'standard-inspec', // 要跳转的路由名称 不是路径
    //     text: '检验标准', // 文本内容
    //     type: 'ios-contrast', // 图标
    //     size: 22 // 图标大小
    //   },
    //   {
    //     name: 'category-list', // 要跳转的路由名称 不是路径
    //     text: '品类列表', // 文本内容
    //     hidden: true
    //   },
    //   {
    //     name: 'category-detail', // 要跳转的路由名称 不是路径
    //     text: '品类详情', // 文本内容
    //     hidden: true
    //   },
    //   {
    //     name: 'account-manage',
    //     text: '账号管理',
    //     type: 'md-people',
    //     size: 22
    //   },
    //   {
    //     name: 'result-manage',
    //     text: '检验结果',
    //     type: 'md-list',
    //     size: 22
    //   }
    // ]
    menuItems: []
  },
  getters: {
    // 初始化登录要跳转的菜单
    initMenus(state) {
      if(state.menuItems.length === 0) {
        return 'error'
      }

      let item = state.menuItems[0]
      if(item) return item.name
    }
  },
  mutations: {
    setMenus(state, items) {
      state.menuItems = [...items]
    }
  },
  modules: {
    login
  }
})

export default store