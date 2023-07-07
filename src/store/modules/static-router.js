import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
// import cloneDeep from 'lodash.clonedeep'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
// function hasPermission (permission, route) {
//   if (route.meta && route.meta.permission) {
//     // console.log('hasPermission', permission)
//     if (permission === undefined) {
//       return false
//     }
//     let flag = false
//     for (let i = 0, len = permission.length; i < len; i++) {
//       flag = route.meta.permission.includes(permission[i])
//       if (flag) {
//         return true
//       }
//     }
//     return false
//   }
//   return true
// }

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

// function filterAsyncRouter (routerMap, role) {
//   const accessedRouters = routerMap.filter(route => {
//     if (hasPermission(role.permissionList, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, role)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        console.log(data, 'is this')
        const role = data.data.menu
        // const routerMap = cloneDeep(asyncRouterMap)
        // const accessedRouters = filterAsyncRouter(routerMap, role)
        // const menuNav = []
        // let childrenNav = []
        const accessedRouters = []
        for (const parent of asyncRouterMap[0].children) {
          for (const child of parent.children) {
            role.map(item => {
              if (item.redirect === child.path) {
                accessedRouters.push(parent)
              }
            })
          }
        }
        console.log(asyncRouterMap[0], accessedRouters, 'is this')
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
