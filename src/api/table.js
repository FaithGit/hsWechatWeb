import request from '@/utils/request'
import setting from '@/settings'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
export function listExam(data) {
  return request({
    url: setting.baseUrl +'/exam/listExam',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: setting.baseUrl +'/sysUser/login',
    method: 'post',
    data
  })
}
export function getVerificationCode(data) {
  return request({
    url: setting.baseUrl +'/sysSup/getVerificationCode',
    method: 'post',
    data
  })
}
export function getUserByToken(data) {
  return request({
    url: setting.baseUrl +'/sysUser/getUserByToken',
    method: 'post',
    data
  })
}
export function exportExcelDemo(data) {
  return request({
    url: setting.baseUrl +'/exam/exportExcelDemo',
    method: 'post',
    data
  })
}
export function getExam(data) {
  return request({
    url: setting.baseUrl +'/exam/getExam',
    method: 'post',
    data
  })
}
export function randomGenerateExam(data) {
  return request({
    url: setting.baseUrl +'/exam/randomGenerateExam',
    method: 'post',
    data
  })
}
export function listVideo(data) {
  return request({
    url: setting.baseUrl +'/video/listVideo',
    method: 'post',
    data
  })
}
export function removeVideo(data) {
  return request({
    url: setting.baseUrl +'/video/removeVideo',
    method: 'post',
    data
  })
}
export function removeExam(data) {
  return request({
    url: setting.baseUrl +'/exam/removeExam',
    method: 'post',
    data
  })
}