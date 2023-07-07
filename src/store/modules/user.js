import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN, LOGIN_ID } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { notification } from 'ant-design-vue'
// import { request } from '@/utils/request'
// import request from '@/utils/request'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    loginID: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_LOGINID: (state, loginID) => {
      state.loginID = loginID
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      console.log('is this login?', userInfo)
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log(response, 'login api')
          if (response.isSuccess) {
            const result = response.data
            storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            storage.set(LOGIN_ID, result.userinfo.userName)
            console.log(storage.get(ACCESS_TOKEN), storage.get(LOGIN_ID))
          } else {
            notification['error']({
              message: '错误',
              description: response.message || '请求出现错误，请稍后再试',
              duration: 4
            })
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getInfo({ token: state.token, loginID: state.loginID }).then(response => {
          const { data } = response
          console.log(data, response, 'getInfo')
          if (data.menu && data.menu.length > 0) {
            const role = data.menu
            console.log(role, 'getInfo role')
            data.permissions = data.menu.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionlist || {}).map(item => item.action)
               }
               console.log(per, 'getInfo permission')
              return per
            })
            data.permissionList = role.map(permission => { return permission.id })
            // 覆盖响应体的 role, 供下游使用
            data.role = role
            console.log(data, 'get info')
            sessionStorage.setItem('menu', JSON.stringify(data.menu))
            commit('SET_ROLES', role)
            commit('SET_INFO', data)
            commit('SET_NAME', { name: data.userinfo.userName, welcome: welcome() })
            // 下游
            resolve(data)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      storage.remove(ACCESS_TOKEN)
    }

  }
}

export default user
