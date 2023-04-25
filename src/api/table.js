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
    url: setting.baseUrl + '/exam/listExam',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: setting.baseUrl + '/sysUser/login',
    method: 'post',
    data
  })
}
export function getVerificationCode(data) {
  return request({
    url: setting.baseUrl + '/sysSup/getVerificationCode',
    method: 'post',
    data
  })
}
export function getUserByToken(data) {
  return request({
    url: setting.baseUrl + '/sysUser/getUserByToken',
    method: 'post',
    data
  })
}
export function exportExcelDemo(data) {
  return request({
    url: setting.baseUrl + '/exam/exportExcelDemo',
    method: 'post',
    data
  })
}
export function getExam(data) {
  return request({
    url: setting.baseUrl + '/exam/getExam',
    method: 'post',
    data
  })
}
export function randomGenerateExam(data) {
  return request({
    url: setting.baseUrl + '/exam/randomGenerateExam',
    method: 'post',
    data
  })
}
export function listVideo(data) {
  return request({
    url: setting.baseUrl + '/video/listVideo',
    method: 'post',
    data
  })
}
export function removeVideo(data) {
  return request({
    url: setting.baseUrl + '/video/removeVideo',
    method: 'post',
    data
  })
}
export function removeExam(data) {
  return request({
    url: setting.baseUrl + '/exam/removeExam',
    method: 'post',
    data
  })
}
export function reagentList(data) {
  return request({
    url: setting.baseUrl + '/reagent/reagentList',
    method: 'post',
    data
  })
}
export function listPharmaceuticalPage(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/listPharmaceuticalPage',
    method: 'post',
    data
  })
}
export function addReagent(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/addReagent',
    method: 'post',
    data
  })
}
export function removeReagent(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/removeReagent',
    method: 'post',
    data
  })
}
export function getReagent(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/getReagent',
    method: 'post',
    data
  })
}
export function addPharmaceutical(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/addPharmaceutical',
    method: 'post',
    data
  })
}
export function updatePharmaceutical(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/updatePharmaceutical',
    method: 'post',
    data
  })
}
export function deletePharmaceutical(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/deletePharmaceutical',
    method: 'post',
    data
  })
}
export function updateReagent(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/updateReagent',
    method: 'post',
    data
  })
}
export function updateReagentPharmaceutical(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/updateReagentPharmaceutical',
    method: 'post',
    data
  })
}
export function removeReagentPharmaceutical(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/removeReagentPharmaceutical',
    method: 'post',
    data
  })
}
export function addReagentPharmaceutical(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/addReagentPharmaceutical',
    method: 'post',
    data
  })
}
export function listStandardSolution(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/listStandardSolution',
    method: 'post',
    data
  })
}
export function addStandardSolution(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/addStandardSolution',
    method: 'post',
    data
  })
}
export function updateStandardSolution(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/updateStandardSolution',
    method: 'post',
    data
  })
}
export function removeStandardSolution(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/removeStandardSolution',
    method: 'post',
    data
  })
}
export function exportPreparationReagent(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/reagent/exportPreparationReagent',
    method: 'post',
    data
  })
}
export function getAreaCodeTree(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/company/getAreaCodeTree',
    method: 'post',
    data
  })
}
export function listCompanyPage(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/company/listCompanyPage',
    method: 'post',
    data
  })
}
export function addCompany(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/company/addCompany',
    method: 'post',
    data
  })
}
export function updateCompany(data) { //药剂列表
  return request({
    url: setting.baseUrl + '/company/updateCompany',
    method: 'post',
    data
  })
}
