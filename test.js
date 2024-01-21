[{
    path: '/system',
    meta: {
      title: '在线信息管理',
      icon: 'dashboard',
    },
    children: [{
        path: 'company',
        meta: {
          title: '企业管理',
          icon: 'company',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'ponit',
        meta: {
          title: '点位管理',
          icon: 'Ponit',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'instrument',
        meta: {
          title: '设备管理',
          icon: 'shebei',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'pointFactor',
        meta: {
          title: '点位因子管理',
          icon: 'pointYinzi',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'factor',
        meta: {
          title: '因子管理',
          icon: 'yinzi',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl']
        }
      },

      {
        path: 'workLoad',
        meta: {
          title: '运维工作量',
          icon: 'workLoad',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl']
        }
      }

    ]
  },

  {
    path: '/rs',
    meta: {
      title: '人事管理',
      icon: 'rs',
    },
    children: [{
        path: 'userInfo',
        meta: {
          title: '人员信息管理',
          icon: 'rs',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']

        }
      },

      {
        path: 'userCertificate',
        meta: {
          title: '人员证书管理',
          icon: 'zhengshu',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']

        }
      },
      {
        path: 'training',
        meta: {
          title: '人员培训管理',
          icon: 'peixun',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']

        }
      },
      {
        path: 'signIn',
        meta: {
          title: '签到记录',
          icon: 'qiandao',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']

        }
      },
      {
        path: 'jobChange',
        meta: {
          title: '人员职位变迁',
          icon: 'zhiwei',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']

        }
      },
      {
        path: 'rewardPunish',
        meta: {
          title: '人员奖惩记录',
          icon: 'jiangcheng',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']

        }
      },

    ]
  },

  {
    path: '/dataQuery',
    meta: {
      title: '数据查询',
      icon: 'yunwei'
    },
    children: [{
        path: 'operateTask',
        meta: {
          title: '在线运维记录',
          icon: 'yunwei',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'xz']
        }
      },
      {
        path: 'onlineEvent',
        meta: {
          title: '在线点位异常事件',
          icon: 'errEvent',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'xz']
        }
      },
      {
        path: 'wechatRz',
        meta: {
          title: '公众号通知记录',
          icon: 'rizhi',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'rizhi',
        meta: {
          title: '系统日志记录',
          icon: 'rizhi',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'tripStatistics',
        meta: {
          title: '车辆里程统计',
          icon: 'licheng',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'driveOilCost',
        meta: {
          title: '车辆油耗统计',
          icon: 'yfgl',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        }
      },
      {
        path: 'loggingStatus',
        meta: {
          title: '人员登录情况',
          icon: 'rizhi',
          roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
        }
      }
    ]
  },

  {
    path: '/sjby',
    meta: {
      title: '标液试剂管理',
      icon: 'pf',
    },
    children: [{
        path: 'yaoji',
        meta: {
          title: '药剂管理',
          icon: 'yaoji',
          roles: ['zjb', 'admin',   'ywybjl', 'ywybfjl', 'syy']
        }
      },
      {
        path: 'shiji',
        meta: {
          title: '试剂管理',
          icon: 'shiji',
          roles: ['zjb', 'admin',   'ywybjl', 'ywybfjl', 'syy']
        }
      },
      {
        path: 'biaoye',
        meta: {
          title: '标液管理',
          icon: 'biaoye',
          roles: ['zjb', 'admin',   'ywybjl', 'ywybfjl', 'syy']
        }
      },
      {
        path: 'peizhi',
        meta: {
          title: '配置过程记录',
          icon: 'guocheng',
          roles: ['zjb', 'admin','ywybjl', 'ywybfjl', 'syy']
        }
      }
    ]
  },
  {
    path: '/report',
    meta: {
      title: '报表',
      icon: 'baobiao',
    },
    children: [{
      path: 'sjBB',
      meta: {
        title: '试剂统计报表',
        icon: 'baobiao',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'syy']
      }
    }, {
      path: 'byBB',
      meta: {
        title: '标液统计报表',
        icon: 'baobiao',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'syy']
      }
    }, ]
  },
  {
    path: '/testPaper',
    meta: {
      title: '试卷管理',
      icon: 'shijuan'
    },
    children: [{
      path: 'shiti',
      meta: {
        title: '试题管理',
        icon: 'shijuan',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }, {
      path: 'index',
      meta: {
        title: '试卷管理',
        icon: 'shijuan',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }, {
      path: 'yuejuan',
      meta: {
        title: '阅卷',
        icon: 'yuejuan',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }, {
      path: 'cuotiji',
      meta: {
        title: '试题答题情况',
        icon: 'cuotiji',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }, {
      path: 'testPaper',
      meta: {
        title: '答题试卷列表',
        icon: 'testList',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }]
  },
  {
    path: '/video',
    children: [{
      path: 'index',
      meta: {
        title: '视频管理',
        icon: 'video',
        roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl']
      }
    }]
  },
]
