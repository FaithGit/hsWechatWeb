import {
  asyncRoutes,
  constantRoutes
} from '@/router'
import LAYOUT from '@/layout'

import {
  listPcUserMenu
} from '@/api/table'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      listPcUserMenu({}).then(res => {
        console.log("!!!!!!!!!", res)

        var loadView = (view) => { // 路由懒加载
          return resolve => require([`@/views/${view}.vue`], resolve)
        }

        function compTree(arr) {
          arr.forEach(e => {
            // console.log(e)
            e.component = loadView(e.component)
            delete e.meta.roles
          })
        }

        var _roleList = res.retData

        _roleList.forEach(e => {
          delete e.meta.roles
          if (e.component === 'Layout') {
            e.component = LAYOUT
          } else {
            e.component = loadView(e.component)
          }

          compTree(e.children)
        })

        console.log("new", _roleList)
        _roleList.push({
          path: '*',
          id: '999',
          redirect: '/404',
          hidden: true
        })

        // let accessedRoutes

        // if (roles.includes('fu')) {
        //   accessedRoutes = asyncRoutes || []
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        // }
        // commit('SET_ROUTES', accessedRoutes)
        // resolve(accessedRoutes)


        commit('SET_ROUTES', _roleList)
        resolve(_roleList)
      })

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
