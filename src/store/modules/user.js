// import { login, logout, getInfo } from '@/api/user'
import {
  login,
  getUserByToken
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
  userId: ""
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
    return new Promise((resolve, reject) => {
      login({
        telephone: username.trim(),
        password: password,
        verificationCode,
        verificationImageId
      }).then(response => {
        console.log("🚀 ~ returnnewPromise ~ response", response)
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
        commit("SET_userInfo", res.retData)
        resolve()
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
