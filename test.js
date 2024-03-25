[
  {
    "id": 27,
    "upMenuId": 0,
    "path": "/setting",
    "name": "Setting",
    "component": "Layout",
    "hidden": false,
    "orderNum": 1,
    "meta": {
      "title": "系统管理",
      "icon": "setting",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 28,
        "upMenuId": 27,
        "path": "user",
        "name": "User",
        "component": "setting/user",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "用户管理",
          "icon": "users",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 29,
        "upMenuId": 27,
        "path": "menu",
        "name": "Menu",
        "component": "setting/menu",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "菜单管理",
          "icon": "menu",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 67,
        "upMenuId": 27,
        "path": "role",
        "name": "Role",
        "component": "setting/role",
        "hidden": false,
        "orderNum": 3,
        "meta": {
          "title": "权限管理",
          "icon": "role",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 69,
        "upMenuId": 27,
        "path": "pim",
        "name": "Pim",
        "component": "setting/pim",
        "hidden": false,
        "orderNum": 4,
        "meta": {
          "title": "药剂信息管理",
          "icon": "pim",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 30,
    "upMenuId": 0,
    "path": "/system",
    "name": "System",
    "component": "Layout",
    "hidden": false,
    "orderNum": 2,
    "meta": {
      "title": "在线信息管理",
      "icon": "dashboard",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 31,
        "upMenuId": 30,
        "path": "company",
        "name": "Company",
        "component": "system/index",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "企业管理",
          "icon": "company",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 32,
        "upMenuId": 30,
        "path": "ponit",
        "name": "Ponit",
        "component": "system/ponit",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "点位管理",
          "icon": "Ponit",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 33,
        "upMenuId": 30,
        "path": "instrument",
        "name": "Instrument",
        "component": "system/instrument",
        "hidden": false,
        "orderNum": 3,
        "meta": {
          "title": "设备管理",
          "icon": "shebei",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 34,
        "upMenuId": 30,
        "path": "pointFactor",
        "name": "PointFactor",
        "component": "system/pointFactor",
        "hidden": false,
        "orderNum": 4,
        "meta": {
          "title": "点位因子管理",
          "icon": "pointYinzi",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 35,
        "upMenuId": 30,
        "path": "factor",
        "name": "Factor",
        "component": "system/factor",
        "hidden": false,
        "orderNum": 5,
        "meta": {
          "title": "因子管理",
          "icon": "yinzi",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 36,
        "upMenuId": 30,
        "path": "workLoad",
        "name": "WorkLoad",
        "component": "system/workLoad",
        "hidden": false,
        "orderNum": 6,
        "meta": {
          "title": "运维工作量",
          "icon": "workLoad",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 37,
    "upMenuId": 0,
    "path": "/rs",
    "name": "Rs",
    "component": "Layout",
    "hidden": false,
    "orderNum": 3,
    "meta": {
      "title": "人事管理",
      "icon": "rs",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 38,
        "upMenuId": 37,
        "path": "userInfo",
        "name": "UserInfo",
        "component": "rs/userInfo",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "人员信息管理",
          "icon": "rs",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 39,
        "upMenuId": 37,
        "path": "userCertificate",
        "name": "UserCertificate",
        "component": "rs/userCertificate",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "人员证书管理",
          "icon": "zhengshu",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 40,
        "upMenuId": 37,
        "path": "signIn",
        "name": "SignIn",
        "component": "rs/signIn",
        "hidden": false,
        "orderNum": 3,
        "meta": {
          "title": "签到记录",
          "icon": "qiandao",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 41,
        "upMenuId": 37,
        "path": "jobChange",
        "name": "JobChange",
        "component": "rs/jobChange",
        "hidden": false,
        "orderNum": 4,
        "meta": {
          "title": "人员职位变迁",
          "icon": "zhiwei",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 42,
        "upMenuId": 37,
        "path": "rewardPunish",
        "name": "RewardPunish",
        "component": "rs/rewardPunish",
        "hidden": false,
        "orderNum": 5,
        "meta": {
          "title": "人员奖惩记录",
          "icon": "jiangcheng",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 43,
    "upMenuId": 0,
    "path": "/dataQuery",
    "name": "DataQuery",
    "component": "Layout",
    "hidden": false,
    "orderNum": 4,
    "meta": {
      "title": "数据查询",
      "icon": "yunwei",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 44,
        "upMenuId": 43,
        "path": "operateTask",
        "name": "OperateTask",
        "component": "dataQuery/operateTask",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "在线运维记录",
          "icon": "yunwei",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 45,
        "upMenuId": 43,
        "path": "onlineEvent",
        "name": "OnlineEvent",
        "component": "dataQuery/OnlineEvent",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "在线点位异常事件",
          "icon": "errEvent",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 46,
        "upMenuId": 43,
        "path": "wechatRz",
        "name": "WechatRz",
        "component": "dataQuery/wechatRz",
        "hidden": false,
        "orderNum": 3,
        "meta": {
          "title": "公众号通知记录",
          "icon": "rizhi",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 47,
        "upMenuId": 43,
        "path": "rizhi",
        "name": "Rizhi",
        "component": "dataQuery/rizhi",
        "hidden": false,
        "orderNum": 4,
        "meta": {
          "title": "系统日志记录",
          "icon": "rizhi",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 48,
        "upMenuId": 43,
        "path": "tripStatistics",
        "name": "TripStatistics",
        "component": "dataQuery/tripStatistics",
        "hidden": false,
        "orderNum": 5,
        "meta": {
          "title": "车辆里程统计",
          "icon": "licheng",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 49,
        "upMenuId": 43,
        "path": "driveOilCost",
        "name": "DriveOilCost",
        "component": "dataQuery/driveOilCost",
        "hidden": false,
        "orderNum": 6,
        "meta": {
          "title": "车辆油耗统计",
          "icon": "yfgl",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 50,
        "upMenuId": 43,
        "path": "loggingStatus",
        "name": "LoggingStatus",
        "component": "dataQuery/loggingStatus",
        "hidden": false,
        "orderNum": 7,
        "meta": {
          "title": "人员登录情况",
          "icon": "rizhi",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 51,
    "upMenuId": 0,
    "path": "/sjby",
    "name": "Sjby",
    "component": "Layout",
    "hidden": false,
    "orderNum": 5,
    "meta": {
      "title": "标液试剂管理",
      "icon": "pf",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 52,
        "upMenuId": 51,
        "path": "yaoji",
        "name": "Yaoji",
        "component": "yaoji/index",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "药剂管理",
          "icon": "yaoji",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 53,
        "upMenuId": 51,
        "path": "shiji",
        "name": "Shiji",
        "component": "shiji/index",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "试剂管理",
          "icon": "shiji",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 54,
        "upMenuId": 51,
        "path": "biaoye",
        "name": "Biaoye",
        "component": "biaoye/index",
        "hidden": false,
        "orderNum": 3,
        "meta": {
          "title": "标液管理",
          "icon": "biaoye",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 55,
        "upMenuId": 51,
        "path": "peizhi",
        "name": "Peizhi",
        "component": "peizhi/index",
        "hidden": false,
        "orderNum": 4,
        "meta": {
          "title": "配置过程记录",
          "icon": "guocheng",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 56,
    "upMenuId": 0,
    "path": "/report",
    "name": "Report",
    "component": "Layout",
    "hidden": false,
    "orderNum": 6,
    "meta": {
      "title": "报表",
      "icon": "baobiao",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 57,
        "upMenuId": 56,
        "path": "sjBB",
        "name": "SjBB",
        "component": "baobiao/sjBB",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "试剂统计报表",
          "icon": "baobiao",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 58,
        "upMenuId": 56,
        "path": "byBB",
        "name": "ByBB",
        "component": "baobiao/byBB",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "标液统计报表",
          "icon": "baobiao",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 59,
    "upMenuId": 0,
    "path": "/testPaper",
    "name": "TestPaper",
    "component": "Layout",
    "hidden": false,
    "orderNum": 7,
    "meta": {
      "title": "试卷管理",
      "icon": "shijuan",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 60,
        "upMenuId": 59,
        "path": "shiti",
        "name": "Shiti",
        "component": "testPaper/shiti",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "试题管理",
          "icon": "shijuan",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 61,
        "upMenuId": 59,
        "path": "index",
        "name": "TestPaper",
        "component": "testPaper/index",
        "hidden": false,
        "orderNum": 2,
        "meta": {
          "title": "试卷管理",
          "icon": "shijuan",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 62,
        "upMenuId": 59,
        "path": "yuejuan",
        "name": "Yuejuan",
        "component": "testPaper/yuejuan",
        "hidden": false,
        "orderNum": 3,
        "meta": {
          "title": "阅卷",
          "icon": "yuejuan",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 63,
        "upMenuId": 59,
        "path": "cuotiji",
        "name": "Cuotiji",
        "component": "testPaper/cuotiji",
        "hidden": false,
        "orderNum": 4,
        "meta": {
          "title": "试题答题情况",
          "icon": "cuotiji",
          "roles": [
            "admin"
          ]
        },
        "children": []
      },
      {
        "id": 64,
        "upMenuId": 59,
        "path": "testPaper",
        "name": "TestPaper",
        "component": "testPaper/testPaper",
        "hidden": false,
        "orderNum": 5,
        "meta": {
          "title": "答题试卷列表",
          "icon": "testList",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  },
  {
    "id": 65,
    "upMenuId": 0,
    "path": "/video",
    "name": "Video",
    "component": "Layout",
    "hidden": false,
    "orderNum": 8,
    "meta": {
      "title": "视频管理",
      "icon": "video",
      "roles": [
        "admin"
      ]
    },
    "children": [
      {
        "id": 66,
        "upMenuId": 65,
        "path": "index",
        "name": "Video",
        "component": "video/index",
        "hidden": false,
        "orderNum": 1,
        "meta": {
          "title": "视频管理",
          "icon": "video",
          "roles": [
            "admin"
          ]
        },
        "children": []
      }
    ]
  }
]