<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        123
      </div>
    </div>
  </div>
</template>

<script>
  import Layout from '@/layout'
  export default {
    name: 'Page404',
    data() {
      return {
        router1: [{
            path: '/system',
            component: Layout,
            meta: {
              title: '在线信息管理',
              icon: 'dashboard'
            },
            children: [{
                path: 'company',
                name: 'Company',
                component: () => import('@/views/system/index'),
                meta: {
                  title: '企业管理',
                  icon: 'company',
                }
              },
              {
                path: 'ponit',
                name: 'Ponit',
                component: () => import('@/views/system/ponit'),
                meta: {
                  title: '点位管理',
                  icon: 'Ponit'
                }
              },
              {
                path: 'instrument',
                name: 'Instrument',
                component: () => import('@/views/system/instrument'),
                meta: {
                  title: '设备管理',
                  icon: 'shebei'
                }
              },
              {
                path: 'pointFactor',
                name: 'PointFactor',
                component: () => import('@/views/system/pointFactor'),
                meta: {
                  title: '点位因子管理',
                  icon: 'pointYinzi'
                }
              },
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
                path: 'userInfo',
                name: 'UserInfo',
                component: () => import('@/views/rs/userInfo'),
                meta: {
                  title: '人员信息管理',
                  icon: 'rs',
                }
              },

              {
                path: 'userCertificate',
                name: 'UserCertificate',
                component: () => import('@/views/rs/userCertificate.vue'),
                meta: {
                  title: '人员证书管理',
                  icon: 'zhengshu',
                }
              },
              {
                path: 'training',
                name: 'Training',
                component: () => import('@/views/rs/training.vue'),
                meta: {
                  title: '人员培训管理',
                  icon: 'peixun',
                }
              },
              {
                path: 'signIn',
                name: 'SignIn',
                component: () => import('@/views/rs/signIn.vue'),
                meta: {
                  title: '签到记录',
                  icon: 'qiandao',
                }
              },
              {
                path: 'jobChange',
                name: 'JobChange',
                component: () => import('@/views/rs/jobChange.vue'),
                meta: {
                  title: '人员职位变迁',
                  icon: 'zhiwei',
                }
              },
              {
                path: 'rewardPunish',
                name: 'RewardPunish',
                component: () => import('@/views/rs/rewardPunish.vue'),
                meta: {
                  title: '人员奖惩记录',
                  icon: 'jiangcheng',
                }
              },

            ]
          },

        ],
        router2: [{
            path: '/system',
            children: [{
                path: 'company',
                meta: {
                  title: '企业管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'ponit',
                meta: {
                  title: '点位管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'instrument',
                meta: {
                  title: '设备管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'pointFactor',
                meta: {
                  title: '点位因子管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
            ]
          },
          {
            path: '/rs',
            children: [{
                path: 'userInfo',
                meta: {
                  title: '人员信息管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'userCertificate',
                meta: {
                  title: '人员证书管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'training',
                meta: {
                  title: '人员培训管理',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'signIn',
                meta: {
                  title: '签到记录',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'jobChange',
                meta: {
                  title: '人员职位变迁',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },
              {
                path: 'rewardPunish',
                meta: {
                  title: '人员奖惩记录',
                  roles: ['zjb', 'admin', 'rs', 'ywybjl', 'ywybfjl', 'ywybzz', 'ywybzy', 'ywybfzz']
                }
              },

            ]
          },

        ],
      }
    },
    mounted() {

      // console.log(this.router1)
      // console.log(this.router2)

      this.router1.forEach((e, i) => {
        if (e.children.length == 0) {
          console.log("无子菜单")
        } else {
          e.children.forEach((ee, ii) => {
            ee.meta.roles=this.router2[i].children[ii].meta.roles
          })
        }
      })

      console.log(this.router1)

    },
  }

</script>
