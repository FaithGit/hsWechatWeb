import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/redirect', // 跳转页
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index.vue')
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard1'
      }
    }]
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export const asyncRoutes = [{
    path: '/system',
    component: Layout,
    meta: {
      title: '在线信息管理',
      icon: 'dashboard',
      roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
    },
    children: [{
        path: 'company',
        name: 'Company',
        component: () => import('@/views/company/index'),
        meta: {
          title: '企业管理',
          icon: 'company'
        }
      },
      {
        path: 'ponit',
        name: 'Ponit',
        component: () => import('@/views/company/ponit'),
        meta: {
          title: '点位管理',
          icon: 'Ponit'
        }
      },
      {
        path: 'shebei',
        name: 'Shebei',
        component: () => import('@/views/company/shebei'),
        meta: {
          title: '设备管理',
          icon: 'shebei'
        }
      },
      {
        path: 'yinziList',
        name: 'YinziList',
        component: () => import('@/views/company/yinziList'),
        meta: {
          title: '点位因子管理',
          icon: 'pointYinzi'
        }
      },
      {
        path: 'yinzi',
        name: 'Yinzi',
        component: () => import('@/views/company/yinzi'),
        meta: {
          title: '因子管理',
          icon: 'yinzi'
        }
      },

      {
        path: 'workLoad',
        name: 'WorkLoad',
        component: () => import('@/views/company/workLoad.vue'),
        meta: {
          title: '运维工作量',
          icon: 'workLoad'
        }
      }

    ]
  },

  {
    path: '/rs',
    component: Layout,
    meta: {
      title: '人事管理',
      icon: 'rs',
    },
    children: [{
        path: 'rygk',
        name: 'Rygk',
        component: () => import('@/views/rs/index'),
        meta: {
          title: '人员信息管理',
          icon: 'rs',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'bgsfzr', 'xz', 'ywebjl']
        }
      },

      {
        path: 'userzhengshu',
        name: 'Userzhengshu',
        component: () => import('@/views/rs/userzhengshu.vue'),
        meta: {
          title: '人员证书管理',
          icon: 'zhengshu',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'bgsfzr', 'sales', 'ywebjl']
        }
      },
      {
        path: 'peixun',
        name: 'Peixun',
        component: () => import('@/views/rs/peixun.vue'),
        meta: {
          title: '人员培训管理',
          icon: 'peixun',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'bgsfzr', 'ywebjl']
        }
      },
      {
        path: 'qiandao',
        name: 'Qiandao',
        component: () => import('@/views/rs/qiaodao.vue'),
        meta: {
          title: '签到记录',
          icon: 'qiandao',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywebjl']
        }
      },
      {
        path: 'zhiwei',
        name: 'Zhiwei',
        component: () => import('@/views/rs/zhiwei.vue'),
        meta: {
          title: '人员职位变迁',
          icon: 'zhiwei',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'bgsfzr', 'ywebjl']
        }
      },
      {
        path: 'jiangcheng',
        name: 'Jiangcheng',
        component: () => import('@/views/rs/jiangcheng.vue'),
        meta: {
          title: '人员奖惩记录',
          icon: 'jiangcheng',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'bgsfzr', 'ywebjl']
        }
      }
    ]
  },

  {
    path: '/dataQuery',
    component: Layout,
    meta: {
      title: '数据查询',
      icon: 'yunwei'
    },
    children: [{
        path: 'index',
        name: 'YunweiList',
        component: () => import('@/views/yunwei/list.vue'),
        meta: {
          title: '在线运维记录',
          icon: 'yunwei',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'xz']
        }
      },
      {
        path: 'errEvent',
        name: 'ErrEvent',
        component: () => import('@/views/yunwei/errEvent.vue'),
        meta: {
          title: '在线点位异常事件',
          icon: 'errEvent',
          roles: ['zjb', 'admin', 'ywybjl', 'ywybfjl', 'xz']
        }
      },
      {
        path: 'wechatRz',
        name: 'WechatRz',
        component: () => import('@/views/company/wechatRz.vue'),
        meta: {
          title: '公众号通知记录',
          icon: 'rizhi'
        }
      },
      {
        path: 'rizhi',
        name: 'Rizhi',
        component: () => import('@/views/company/rizhi.vue'),
        meta: {
          title: '系统日志记录',
          icon: 'rizhi'
        }
      },
      {
        path: 'yfgl',
        name: 'Yfgl',
        component: () => import('@/views/company/yfgl.vue'),
        meta: {
          title: '车辆里程统计',
          icon: 'licheng'
        }
      },
      {
        path: 'pjyh',
        name: 'Pjyh',
        component: () => import('@/views/company/pjyh.vue'),
        meta: {
          title: '车辆油耗统计',
          icon: 'yfgl'
        }
      }
    ]
  },

  {
    path: '/sjby',
    component: Layout,
    meta: {
      title: '标液试剂管理',
      icon: 'pf',
      roles: ['syy', 'admin']
    },
    children: [{
        path: 'yaoji',
        name: 'Yaoji',
        component: () => import('@/views/yaoji/index'),
        meta: {
          title: '药剂管理',
          icon: 'yaoji'
        }
      },
      {
        path: 'shiji',
        name: 'Shiji',
        component: () => import('@/views/shiji/index'),
        meta: {
          title: '试剂管理',
          icon: 'shiji'
        }
      },
      {
        path: 'biaoye',
        name: 'Biaoye',
        component: () => import('@/views/biaoye/index'),
        meta: {
          title: '标液管理',
          icon: 'biaoye'
        }
      },
      {
        path: 'peizhi',
        name: 'Peizhi',
        component: () => import('@/views/peizhi/index'),
        meta: {
          title: '配置过程记录',
          icon: 'guocheng'
        }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    meta: {
      title: '报表',
      icon: 'baobiao',
      roles: ['syy', 'admin']
    },
    children: [{
      path: 'sjBB',
      name: 'SjBB',
      component: () => import('@/views/baobiao/sjBB.vue'),
      meta: {
        title: '试剂统计报表',
        icon: 'baobiao'
      }
    }, {
      path: 'byBB',
      name: 'ByBB',
      component: () => import('@/views/baobiao/byBB.vue'),
      meta: {
        title: '标液统计报表',
        icon: 'baobiao'
      }
    }, ]
  },
  {
    path: '/testPaper',
    component: Layout,
    meta: {
      title: '试卷管理',
      icon: 'shijuan',
      roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
    },
    children: [{
      path: 'shiti',
      name: 'Shiti',
      component: () => import('@/views/testPaper/shiti'),
      meta: {
        title: '试题管理',
        icon: 'shijuan'
      }
    }, {
      path: 'index',
      name: 'TestPaper',
      component: () => import('@/views/testPaper/index'),
      meta: {
        title: '试卷管理',
        icon: 'shijuan'
      }
    }, {
      path: 'yuejuan',
      name: 'Yuejuan',
      component: () => import('@/views/testPaper/yuejuan'),
      meta: {
        title: '阅卷',
        icon: 'yuejuan'
      }
    }, {
      path: 'cuotiji',
      name: 'Cuotiji',
      component: () => import('@/views/testPaper/cuotiji'),
      meta: {
        title: '试题答题情况',
        icon: 'cuotiji'
      }
    }, {
      path: 'testPaper',
      name: 'TestPaper',
      component: () => import('@/views/testPaper/testPaper'),
      meta: {
        title: '答题试卷列表',
        icon: 'testList'
      }
    }]
  },
  {
    path: '/video',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Video',
      component: () => import('@/views/video/index'),
      meta: {
        title: '视频管理',
        icon: 'video',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }]
  },
  {
    path: '*',
    id: '999',
    redirect: '/404',
    hidden: true
  }
]

export default router
