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
export function listPharmaceuticalPage(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/listPharmaceuticalPage',
    method: 'post',
    data
  })
}
export function addReagent(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/addReagent',
    method: 'post',
    data
  })
}
export function removeReagent(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/removeReagent',
    method: 'post',
    data
  })
}
export function getReagent(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/getReagent',
    method: 'post',
    data
  })
}
export function addPharmaceutical(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/addPharmaceutical',
    method: 'post',
    data
  })
}
export function updatePharmaceutical(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/updatePharmaceutical',
    method: 'post',
    data
  })
}
export function deletePharmaceutical(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/deletePharmaceutical',
    method: 'post',
    data
  })
}
export function updateReagent(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/updateReagent',
    method: 'post',
    data
  })
}
export function updateReagentPharmaceutical(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/updateReagentPharmaceutical',
    method: 'post',
    data
  })
}
export function removeReagentPharmaceutical(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/removeReagentPharmaceutical',
    method: 'post',
    data
  })
}
export function addReagentPharmaceutical(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/addReagentPharmaceutical',
    method: 'post',
    data
  })
}
export function listStandardSolution(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/listStandardSolution',
    method: 'post',
    data
  })
}
export function addStandardSolution(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/addStandardSolution',
    method: 'post',
    data
  })
}
export function updateStandardSolution(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/updateStandardSolution',
    method: 'post',
    data
  })
}
export function removeStandardSolution(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/standardSolution/removeStandardSolution',
    method: 'post',
    data
  })
}
export function exportPreparationReagent(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/reagent/exportPreparationReagent',
    method: 'post',
    data
  })
}
export function getAreaCodeTree(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/company/getAreaCodeTree',
    method: 'post',
    data
  })
}
export function listCompanyPage(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/company/listCompanyPage',
    method: 'post',
    data
  })
}
export function addCompany(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/company/addCompany',
    method: 'post',
    data
  })
}
export function updateCompany(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/company/updateCompany',
    method: 'post',
    data
  })
}
export function listPointPage(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/point/listPointPage',
    method: 'post',
    data
  })
}
export function listCompanySel(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/company/listCompanySel',
    method: 'post',
    data
  })
}
export function listGroupSel(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/group/listGroupSel',
    method: 'post',
    data
  })
}
export function addPoint(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/point/addPoint',
    method: 'post',
    data
  })
}
export function updatePoint(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/point/updatePoint',
    method: 'post',
    data
  })
}
export function listInstrumentTypeSel(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/instrument/listInstrumentTypeSel',
    method: 'post',
    data
  })
}
export function listShortPointSel(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/point/listShortPointSel',
    method: 'post',
    data
  })
}
export function listInstrumentPage(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/instrument/listInstrumentPage',
    method: 'post',
    data
  })
}
export function addInstrument(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/instrument/addInstrument',
    method: 'post',
    data
  })
}
export function updateInstrument(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/instrument/updateInstrument',
    method: 'post',
    data
  })
}
export function listPointFactorPage(data) { // 药剂列表
  return request({
    url: setting.baseUrl + '/point/listPointFactorPage',
    method: 'post',
    data
  })
}
export function listFactorSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/listFactorSel',
    method: 'post',
    data
  })
}
export function addPointFactor(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/addPointFactor',
    method: 'post',
    data
  })
}
export function updatePointFactor(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/updatePointFactor',
    method: 'post',
    data
  })
}
export function deletePointFactor(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/deletePointFactor',
    method: 'post',
    data
  })
}
