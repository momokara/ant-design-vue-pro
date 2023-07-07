import axios from 'axios'
// import store from '@/store'
import { VueAxios } from './axios'
import storage from 'store'
import { ACCESS_TOKEN, LOGIN_ID } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'

/**
 * http://new.photo3050.com:8081  线上
 * http://192.168.0.55:8088 本地
*/
// const _baseURL = 'http://192.168.0.54:8086'
const _baseURL = 'http://localhost:8080'

export const request = function (api, params, encrypt, method) {
  // showLoading('加载中，请稍候')
  const _loginID = storage.get(LOGIN_ID) || ''
  const _token = storage.get(ACCESS_TOKEN) || ''
  const baseData = {
    Token: _token,
    LoginID: _loginID
  }
  const data = Object.assign(baseData, params)
  // const sqlSafe = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  return new Promise((resolve, reject) => {
    axios({
      method: method || 'POST',
      url: api,
      baseURL: _baseURL + '/api/DriverExam/',
      data: data,
      timeout: 30000
    })
      .then((res) => {
        console.log(`${api} request`)
        switch (res.status) {
          case 200:
            if (res.data.isSuccess) {
              notification.success({
                message: '提示',
                description: res.data.message || '操作成功'
              })
              resolve(res.data)
            } else {
              notification.error({
                message: '提示',
                description: res.data.message || '操作失败'
              })
              resolve(res.data)
            }
            break
          default:
            notification.error({
              message: '提示',
              description: `http状态码: ${res.status},错误信息: ${res.errMsg}`
            })
            break
        }
        // hideLoading();
      })
      .catch(err => {
        console.log(err, `${api} request failed`)
        const _message = () => {
          if (String(err).includes('timeout')) {
            return `您的网络发生异常，无法连接服务器，请稍后再试`
          } else if (String(err).includes('401')) {
            return `无效的授权码`
          } else if (!_loginID) {
            return `登陆状态过期，请重新登录`
          } else {
            return `未知错误，错误信息: ${err}`
          }
        }
        notification.error({
          message: '提示',
          description: _message
        })
        // hideLoading();
        reject(err)
      })
  })
}

// 创建 axios 实例
// const request = axios.create({
//   // API 请求的默认前缀
//   // baseURL: process.env.VUE_APP_API_BASE_URL,
//   baseURL: 'http://localhost:8080/api/DriverExam/',
//   timeout: 6000 // 请求超时时间
// })

// 异常拦截处理器
// const errorHandler = (error) => {
//   console.log(error, 'is this?')
//   if (error.response) {
//     const data = error.response.data
//     // 从 localstorage 获取 token
//     const token = storage.get(ACCESS_TOKEN)
//     if (error.response.status === 403) {
//       notification.error({
//         message: 'Forbidden',
//         description: data.message
//       })
//     }
//     if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
//       notification.error({
//         message: 'Unauthorized',
//         description: 'Authorization verification failed'
//       })
//       if (token) {
//         store.dispatch('Logout').then(() => {
//           setTimeout(() => {
//             window.location.reload()
//           }, 1500)
//         })
//       }
//     }
//   }
//   return Promise.reject(error)
// }

// // request interceptor
// request.interceptors.request.use(config => {
//   const token = storage.get(ACCESS_TOKEN)
//   // 如果 token 存在
//   // 让每个请求携带自定义 token 请根据实际情况自行修改
//   if (token) {
//     config.headers[ACCESS_TOKEN] = token
//   }
//   return config
// }, errorHandler)

// // response interceptor
// request.interceptors.response.use((response) => {
//   console.log(response, ' is this')
//   return response.data
// }, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

// export default request

export {
  installer as VueAxios
}
