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
      title: '工作台',
      icon: 'dashboard'
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
      icon: 'video'
    }
  }]
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
  }
  ]
},
{
  path: '/system',
  component: Layout,
  meta: {
    title: '系统管理',
    icon: 'dashboard',
    roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
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
      icon: 'yinzi'
    }
  }
  ]
}, {
  path: '/rs',
  component: Layout,
  meta: {
    title: '人事管理',
    icon: 'rs',
    roles: ['zjb', 'admin', 'rs']
  },
  children: [{
    path: 'rygk',
    name: 'Rygk',
    component: () => import('@/views/rs/index'),
    meta: {
      title: '人员管理',
      icon: 'rs'
    }
  },

  {
    path: 'userzhengshu',
    name: 'Userzhengshu',
    component: () => import('@/views/rs/userzhengshu.vue'),
    meta: {
      title: '用户证书管理',
      icon: 'zhengshu'
    }
  },
  {
    path: 'zhengshu',
    name: 'Zhengshu',
    component: () => import('@/views/rs/zhengshu.vue'),
    meta: {
      title: '证书管理',
      icon: 'zhengshu'
    }
  },
  {
    path: 'userPeixun',
    name: 'UserPeixun',
    component: () => import('@/views/rs/userPeixun.vue'),
    meta: {
      title: '用户培训管理',
      icon: 'peixun'
    }
  },
  {
    path: 'peixun',
    name: 'Peixun',
    component: () => import('@/views/rs/peixun.vue'),
    meta: {
      title: '培训管理',
      icon: 'peixun'
    }
  },
  {
    path: 'zhiwei',
    name: 'Zhiwei',
    component: () => import('@/views/rs/zhiwei.vue'),
    meta: {
      title: '用户职位变迁',
      icon: 'zhiwei'
    }
  },
  {
    path: 'jiangcheng',
    name: 'Jiangcheng',
    component: () => import('@/views/rs/jiangcheng.vue'),
    meta: {
      title: '用户奖惩记录',
      icon: 'jiangcheng'
    }
  }

  ]
},
{
  path: '*',
  id: '999',
  redirect: '/404',
  hidden: true
}
]

export default router
