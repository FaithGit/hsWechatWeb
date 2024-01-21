import {
  asyncRoutes,
  constantRoutes
} from '@/router'

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
      let accessedRoutes
      if (roles.includes('fu')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // var router2 = [{
        //     path: '/system',
        //     meta: {
        //       title: '在线信息管理',
        //       roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //     },
        //     children: [{
        //         path: 'company',
        //         meta: {
        //           title: '企业管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'ponit',
        //         meta: {
        //           title: '点位管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'instrument',
        //         meta: {
        //           title: '设备管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'pointFactor',
        //         meta: {
        //           title: '点位因子管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //     ]
        //   },
        //   {
        //     path: '/rs',
        //     meta: {
        //       title: '人事管理',
        //       roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //     },
        //     children: [{
        //         path: 'userInfo',
        //         meta: {
        //           title: '人员信息管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //         }
        //       },
        //       {
        //         path: 'userCertificate',
        //         meta: {
        //           title: '人员证书管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //         }
        //       },
        //       {
        //         path: 'training',
        //         meta: {
        //           title: '人员培训管理',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //         }
        //       },
        //       {
        //         path: 'signIn',
        //         meta: {
        //           title: '签到记录',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //         }
        //       },
        //       {
        //         path: 'jobChange',
        //         meta: {
        //           title: '人员职位变迁',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //         }
        //       },
        //       {
        //         path: 'rewardPunish',
        //         meta: {
        //           title: '人员奖惩记录',
        //           roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'rs']
        //         }
        //       },

        //     ]
        //   },

        //   {
        //     path: '/dataQuery',
        //     children: [{
        //         path: 'operateTask',
        //         meta: {
        //           title: '在线运维记录',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'xz']
        //         }
        //       },
        //       {
        //         path: 'onlineEvent',
        //         meta: {
        //           title: '在线点位异常事件',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'xz']
        //         }
        //       },
        //       {
        //         path: 'wechatRz',
        //         meta: {
        //           title: '公众号通知记录',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'rizhi',
        //         meta: {
        //           title: '系统日志记录',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'tripStatistics',
        //         meta: {
        //           title: '车辆里程统计',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'driveOilCost',
        //         meta: {
        //           title: '车辆油耗统计',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        //         }
        //       },
        //       {
        //         path: 'loggingStatus',
        //         meta: {
        //           title: '人员登录情况',
        //           roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        //         }
        //       }
        //     ]
        //   },

        //   {
        //     path: '/sjby',
        //     children: [{
        //         path: 'yaoji',
        //         meta: {
        //           title: '药剂管理',
        //           roles: ['syy', 'admin']
        //         }
        //       },
        //       {
        //         path: 'shiji',
        //         meta: {
        //           title: '试剂管理',
        //           roles: ['syy', 'admin']
        //         }
        //       },
        //       {
        //         path: 'biaoye',
        //         meta: {
        //           title: '标液管理',
        //           roles: ['syy', 'admin']
        //         }
        //       },
        //       {
        //         path: 'peizhi',
        //         meta: {
        //           title: '配置过程记录',
        //           roles: ['syy', 'admin']
        //         }
        //       }
        //     ]
        //   },
        //   {
        //     path: '/report',
        //     children: [{
        //       path: 'sjBB',
        //       meta: {
        //         title: '试剂统计报表',
        //         roles: ['syy', 'admin']
        //       }
        //     }, {
        //       path: 'byBB',
        //       meta: {
        //         title: '标液统计报表',
        //         roles: ['syy', 'admin']
        //       }
        //     }, ]
        //   },
        //   {
        //     path: '/testPaper',
        //     children: [{
        //       path: 'shiti',
        //       meta: {
        //         title: '试题管理',
        //         roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //       }
        //     }, {
        //       path: 'index',
        //       meta: {
        //         title: '试卷管理',
        //         roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //       }
        //     }, {
        //       path: 'yuejuan',
        //       meta: {
        //         title: '阅卷',
        //         roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //       }
        //     }, {
        //       path: 'cuotiji',
        //       meta: {
        //         title: '试题答题情况',
        //         roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //       }
        //     }, {
        //       path: 'testPaper',
        //       meta: {
        //         title: '答题试卷列表',
        //         roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //       }
        //     }]
        //   },
        //   {
        //     path: '/video',
        //     children: [{
        //       path: 'index',
        //       meta: {
        //         title: '视频管理',
        //         roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl']
        //       }
        //     }]
        //   },

        // ]

        // router2.forEach((e, i) => {
        //   if (e.children.length == 0) {
        //     console.log("无子菜单")
        //   } else {
        //     e.children.forEach((ee, ii) => {
        //       asyncRoutes[i].children[ii].meta.roles = ee.meta.roles.length == 0 ? '' : ee.meta.roles
        //       asyncRoutes[i].children[ii].meta.title = ee.meta.title
        //     })
        //   }
        // })



        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
