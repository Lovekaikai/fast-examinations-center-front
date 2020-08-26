import myStorage from 'utils/localstore'

export default {
    state: {
        // userData: myStorage.get('userData') // 用户信息
        userData: {} // 用户信息
    },

    mutations: {
        // 初始化用户信息
        initUser(state) {
            let user  = myStorage.get('fdp-userData')
            if(user) {
                state.userData = user
            }
        },
        setUserData(state,data) {
            state.userData = data
            // 将用户信息保存到本地
            myStorage.set('fdp-userData',data)
        }
    }
}