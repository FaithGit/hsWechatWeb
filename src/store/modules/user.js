// import { login, logout, getInfo } from '@/api/user'
import {
  login,
  getUserByToken,
  addLoginLog
} from '@/api/table'
import {
  setToken,
  getToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const state = {
  token: '',
  name: '',
  avatar: '',
  userId: '',
  roleId: '',
  groupId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_userInfo: (state, userInfo) => {
    state.userId = userInfo.userId
    state.userName = userInfo.userName
    state.roleId = userInfo.roleId
    state.groupId = userInfo.groupId
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      verificationCode,
      verificationImageId
    } = userInfo

    var C = require('crypto-js')
    // 需要加密的字符串
    const str = password
    // 密码
    const pwd = 'hskj_1207_202309'
    // 加密
    const ciphertext = C.AES.encrypt(str, C.enc.Utf8.parse(pwd), {
      mode: C.mode.ECB,
      padding: C.pad.Pkcs7
    }).toString()

    return new Promise((resolve, reject) => {
      login({
        telephone: username.trim(),
        password: ciphertext,
        verificationCode,
        verificationImageId
      }).then(response => {
        console.log('🚀 ~ returnnewPromise ~ response', response)
        commit('SET_TOKEN', response.retData)
        setToken(response.retData)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUserByToken({
        token: getToken()
      }).then(res => {
        console.log('res', res)
        commit('SET_userInfo', res.retData)

        // addLoginLog({
        //   type: 2
        // })

        resolve(res.retData.roleId)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      commit('SET_userInfo', '')
      commit('SET_TOKEN', '')
      commit('SET_AVATAR', '')
      commit('SET_NAME', '')
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
