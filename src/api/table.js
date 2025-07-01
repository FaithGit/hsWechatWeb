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
export function listRoleSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listRoleSel',
    method: 'post',
    data
  })
}
export function listQuestionPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/listQuestionPage',
    method: 'post',
    data
  })
}
export function removeQuestion(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/removeQuestion',
    method: 'post',
    data
  })
}
export function addQuestion(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/addQuestion',
    method: 'post',
    data
  })
}
export function getQuestionDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/getQuestionDetail',
    method: 'post',
    data
  })
}
export function updateQuestion(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/updateQuestion',
    method: 'post',
    data
  })
}
export function listEssayQuestionPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/listEssayQuestionPage',
    method: 'post',
    data
  })
}
export function readOverQuestion(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/readOverQuestion',
    method: 'post',
    data
  })
}
export function listUserInfoPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listUserInfoPage',
    method: 'post',
    data
  })
}
export function listCertificatePage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listCertificatePage',
    method: 'post',
    data
  })
}
export function addCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addCertificate',
    method: 'post',
    data
  })
}
export function deleteCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/deleteCertificate',
    method: 'post',
    data
  })
}
export function updateCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateCertificate',
    method: 'post',
    data
  })
}
export function listDepartment(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listDepartment',
    method: 'post',
    data
  })
}
export function getCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getCertificate',
    method: 'post',
    data
  })
}
export function listCertificateSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listCertificateSel',
    method: 'post',
    data
  })
}
export function listUser(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listUser',
    method: 'post',
    data
  })
}
export function listUserCertificatePage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listUserCertificatePage',
    method: 'post',
    data
  })
}
export function addUserInfo(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addUserInfo',
    method: 'post',
    data
  })
}
export function getUserInfoDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getUserInfoDetail',
    method: 'post',
    data
  })
}
export function updateUserInfo(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateUserInfo',
    method: 'post',
    data
  })
}
export function addUserCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addUserCertificate',
    method: 'post',
    data
  })
}
export function deleteUserCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/deleteUserCertificate',
    method: 'post',
    data
  })
}
export function getUserCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getUserCertificate',
    method: 'post',
    data
  })
}
export function updateUserCertificate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateUserCertificate',
    method: 'post',
    data
  })
}
export function listTrainingPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listTrainingPage',
    method: 'post',
    data
  })
}
export function addTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addTraining',
    method: 'post',
    data
  })
}
export function getTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getTraining',
    method: 'post',
    data
  })
}
export function deleteTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/deleteTraining',
    method: 'post',
    data
  })
}
export function updateTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateTraining',
    method: 'post',
    data
  })
}
export function listUserTrainingPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listUserTrainingPage',
    method: 'post',
    data
  })
}
export function listTrainingSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listTrainingSel',
    method: 'post',
    data
  })
}
export function addUserTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addUserTraining',
    method: 'post',
    data
  })
}
export function getUserTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getUserTraining',
    method: 'post',
    data
  })
}
export function updateUserTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateUserTraining',
    method: 'post',
    data
  })
}
export function deleteUserTraining(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/deleteUserTraining',
    method: 'post',
    data
  })
}
export function listRewardPunishPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listRewardPunishPage',
    method: 'post',
    data
  })
}
export function updateRewardPunish(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateRewardPunish',
    method: 'post',
    data
  })
}
export function addRewardPunish(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addRewardPunish',
    method: 'post',
    data
  })
}
export function getRewardPunish(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getRewardPunish',
    method: 'post',
    data
  })
}
export function deleteRewardPunish(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/deleteRewardPunish',
    method: 'post',
    data
  })
}
export function listJobChangePage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/listJobChangePage',
    method: 'post',
    data
  })
}
export function addJobChange(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/addJobChange',
    method: 'post',
    data
  })
}
export function getJobChangeDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/getJobChangeDetail',
    method: 'post',
    data
  })
}
export function updateJobChange(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/updateJobChange',
    method: 'post',
    data
  })
}
export function deleteJobChange(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/deleteJobChange',
    method: 'post',
    data
  })
}
export function listQuestionStatisticsPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/listQuestionStatisticsPage',
    method: 'post',
    data
  })
}
export function lisDischargeStandard(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/lisDischargeStandard',
    method: 'post',
    data
  })
}
export function deleteCompany(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/deleteCompany',
    method: 'post',
    data
  })
}
export function deletePoint(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/deletePoint',
    method: 'post',
    data
  })
}
export function deleteInstrument(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/deleteInstrument',
    method: 'post',
    data
  })
}
export function exportPoint(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/exportPoint',
    method: 'post',
    data
  })
}
export function listUserExamPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/listUserExamPage',
    method: 'post',
    data
  })
}
export function exportUserExam(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/exportUserExam',
    method: 'post',
    data
  })
}
export function getCompanyById(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/getCompanyById',
    method: 'post',
    data
  })
}
export function getFactor(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/getFactor',
    method: 'post',
    data
  })
}
export function listUserTree(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listUserTree',
    method: 'post',
    data
  })
}
export function listFactorPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/listFactorPage',
    method: 'post',
    data
  })
}
export function addFactor(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/addFactor',
    method: 'post',
    data
  })
}
export function updateFactor(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/updateFactor',
    method: 'post',
    data
  })
}
export function getFactorById(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/getFactorById',
    method: 'post',
    data
  })
}
export function getPointById(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/getPointById',
    method: 'post',
    data
  })
}
export function getInstrumentById(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/getInstrumentById',
    method: 'post',
    data
  })
}
export function getPointQRCode(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/operate/getPointQRCode',
    method: 'post',
    data
  })
}
export function listOplog(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysSup/listOplog',
    method: 'post',
    data
  })
}
export function addLoginLog(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysSup/addLoginLog',
    method: 'post',
    data
  })
}
export function listOperateTaskPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/operate/listOperateTaskPage',
    method: 'post',
    data
  })
}
export function listOperateTaskPageOnPC(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/operate/listOperateTaskPageOnPC',
    method: 'post',
    data
  })
}
export function getBasicInfoNum(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/index/getBasicInfoNum',
    method: 'post',
    data
  })
}
export function listOperateNumInThePastWeek(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/index/listOperateNumInThePastWeek',
    method: 'post',
    data
  })
}
export function listReagentInfoInThePastMonth(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/index/listReagentInfoInThePastMonth',
    method: 'post',
    data
  })
}
export function listStandardSolutionInfoInThePastMonth(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/index/listStandardSolutionInfoInThePastMonth',
    method: 'post',
    data
  })
}
export function getRecentExam(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/index/getRecentExam',
    method: 'post',
    data
  })
}
export function listVehicle(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/listVehicle',
    // url:'http://192.168.2.36:9003/haisheng/gps/listVehicle',

    method: 'post',
    data
  })
}
export function getTripStatistics(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/getTripStatistics',
    method: 'post',
    data
  })
}
export function listDriveOilCost(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/oilFee/listDriveOilCost',
    method: 'post',
    data
  })
}
export function oilFeeexportExcelDemo(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/oilFee/exportExcelDemo',
    method: 'post',
    data
  })
}
export function listOilFeeTreeList(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/oilFee/listOilFeeTreeList',
    method: 'post',
    data
  })
}
export function listTripDetailPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/listTripDetailPage',
    method: 'post',
    data
  })
}
export function listOperate(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/operate/listOperate',
    method: 'post',
    data
  })
}
export function listStepTrees(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/operate/listStepTrees',
    method: 'post',
    data
  })
}
export function listReagentConfigurationProcess(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/listReagentConfigurationProcess',
    method: 'post',
    data
  })
}

export function listEventCodeChoose(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/online/listEventCodeChoose',
    method: 'post',
    data
  })
}
export function listOnlineEvent(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/online/listOnlineEvent',
    method: 'post',
    data
  })
}
export function listPointFactorByPointId(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/online/listPointFactorByPointId',
    method: 'post',
    data
  })
}
export function listDictionarySel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysSup/listDictionarySel',
    method: 'post',
    data
  })
}
export function listReagentDepartment(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/listReagentDepartment',
    method: 'post',
    data
  })
}
export function listGroupByDepartment(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/group/listGroupByDepartment',
    method: 'post',
    data
  })
}
export function getReagentStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/getReagentStatement',
    method: 'post',
    data
  })
}
export function getPharmaceuticalStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/getPharmaceuticalStatement',
    method: 'post',
    data
  })
}
export function reagentStatementDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/reagentStatementDetail',
    method: 'post',
    data
  })
}
export function getStandardSolutionStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/getStandardSolutionStatement',
    method: 'post',
    data
  })
}
export function getStandardLiquidStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/getStandardLiquidStatement',
    method: 'post',
    data
  })
}
export function listStandardSolutionStatementDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/listStandardSolutionStatementDetail',
    method: 'post',
    data
  })
}
export function listSignInPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/signIn/listSignInPage',
    method: 'post',
    data
  })
}
export function exportReagentStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/exportReagentStatement',
    method: 'post',
    data
  })
}
export function exportPharmaceuticalStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/exportPharmaceuticalStatement',
    method: 'post',
    data
  })
}
export function exportReagentStatementDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/exportReagentStatementDetail',
    method: 'post',
    data
  })
}
export function exportStandardSolutionStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/exportStandardSolutionStatement',
    method: 'post',
    data
  })
}
export function exportStandardLiquidStatement(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/exportStandardLiquidStatement',
    method: 'post',
    data
  })
}
export function exportStandardSolutionStatementDetail(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/exportStandardSolutionStatementDetail',
    method: 'post',
    data
  })
}
export function addSignIn(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/signIn/addSignIn',
    method: 'post',
    data
  })
}
export function removeUser(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/removeUser',
    method: 'post',
    data
  })
}
export function listWxMessageLog(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/wechatPublicAccount/listWxMessageLog',
    method: 'post',
    data
  })
}
export function listWorkload(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/listWorkload',
    method: 'post',
    data
  })
}
export function listInstrumentType(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/listInstrumentType',
    method: 'post',
    data
  })
}
export function getInstrumentType(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/getInstrumentType',
    method: 'post',
    data
  })
}
export function updateInstrumentType(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/updateInstrumentType',
    method: 'post',
    data
  })
}
export function updateWorkloadCoefficient(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/updateWorkloadCoefficient',
    method: 'post',
    data
  })
}
export function updateInstrumentWorkload(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/updateInstrumentWorkload',
    method: 'post',
    data
  })
}
export function listKhLoginInfo(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysSup/listKhLoginInfo',
    method: 'post',
    data
  })
}
export function listRole(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listRole',
    method: 'post',
    data
  })
}
export function listGroup(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/group/listGroup',
    method: 'post',
    data
  })
}
export function listUserPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listUserPage',
    method: 'post',
    data
  })
}
export function addUser(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/addUser',
    method: 'post',
    data
  })
}
export function getUser(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/getUser',
    method: 'post',
    data
  })
}

export function updateUser(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/updateUser',
    method: 'post',
    data
  })
}
export function addRole(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/addRole',
    method: 'post',
    data
  })
}
export function addGroup(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/group/addGroup',
    method: 'post',
    data
  })
}
export function listPcRoleMenus(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/listPcRoleMenus',
    method: 'post',
    data
  })
}
export function listPcUserMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/listPcUserMenu',
    method: 'post',
    data
  })
}
export function listPcMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/listPcMenu',
    method: 'post',
    data
  })
}
export function getPcMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/getPcMenu',
    method: 'post',
    data
  })
}
export function deletePcMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/deletePcMenu',
    method: 'post',
    data
  })
}
export function addPcMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/addPcMenu',
    method: 'post',
    data
  })
}
export function updatePcMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/updatePcMenu',
    method: 'post',
    data
  })
}
export function updatePcRoleMenu(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sys/updatePcRoleMenu',
    method: 'post',
    data
  })
}
export function exportWorkload(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/exportWorkload',
    method: 'post',
    data
  })
}
export function listFaultHandleByInstrumentType(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/listFaultHandleByInstrumentType',
    method: 'post',
    data
  })
}
export function addFaultHandle(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/addFaultHandle',
    method: 'post',
    data
  })
}
export function updateFaultHandle(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/updateFaultHandle',
    method: 'post',
    data
  })
}
export function deleteFaultHandle(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/deleteFaultHandle',
    method: 'post',
    data
  })
}
export function listPharmaceuticalProvideVO(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/manHour/listPharmaceuticalProvideVO',
    method: 'post',
    data
  })
}
export function updatePharmaceuticalProvide(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/manHour/updatePharmaceuticalProvide',
    method: 'post',
    data
  })
}
export function gpsDepartmentSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/gpsDepartmentSel',
    method: 'post',
    data
  })
}
export function listLicensePlateSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/listLicensePlateSel',
    method: 'post',
    data
  })
}
export function listHisComparisonPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/comparison/listHisComparisonPage',
    method: 'post',
    data
  })
}

export function listLatestComparisonByPointPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/comparison/listLatestComparisonByPointPage',
    method: 'post',
    data
  })
}

export function getWorkloadPdf(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/getWorkloadPdf',
    method: 'post',
    data
  })
}
export function uploadWorkloadPdf(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/uploadWorkloadPdf',
    method: 'post',
    data
  })
}
export function pointMapList(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/online/pointMapList',
    method: 'post',
    data
  })
}
export function preAddCompany(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/company/preAddCompany',
    method: 'post',
    data
  })
}

export function pointInfoList(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/online/pointInfoList',
    method: 'post',
    data
  })
}

export function listGpsDriveLogPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/listGpsDriveLogPage',
    method: 'post',
    data
  })
}
export function exportGpsDriveLog(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gps/exportGpsDriveLog',
    method: 'post',
    data
  })
}
export function listLoginIndoRoleSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysSup/listLoginIndoRoleSel',
    method: 'post',
    data
  })
}
export function listOperateGroupSel(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/group/listOperateGroupSel',
    method: 'post',
    data
  })
}

export function listAreaMap(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysSup/listAreaMap',
    method: 'post',
    data
  })
}
export function listOnlineData(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/online/listOnlineData',
    method: 'post',
    data
  })
}
export function listUserSelChoose(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/sysUser/listUserSelChoose',
    method: 'post',
    data
  })
}

export function exportUserInfo(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/personalRecords/exportUserInfo',
    method: 'post',
    data
  })
}

export function updateActualQuantity(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/updateActualQuantity',
    method: 'post',
    data
  })
}
export function listStandardSolutionProcess(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/listStandardSolutionProcess',
    method: 'post',
    data
  })
}
export function updateRealSamplingQuantity(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/standardSolution/updateRealSamplingQuantity',
    method: 'post',
    data
  })
}
export function bottleInfoList(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/reagent/bottleInfoList',
    method: 'post',
    data
  })
}
export function pagePushResultVO(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/pushRecord/pagePushResultVO',
    method: 'post',
    data
  })
}
export function savePushRecord(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/pushRecord/savePushRecord',
    method: 'post',
    data
  })
}
export function removePushRecord(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/pushRecord/removePushRecord',
    method: 'post',
    data
  })
}
export function updatePushRecord(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/pushRecord/updatePushRecord',
    method: 'post',
    data
  })
}
export function savePointStopRecord(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/savePointStopRecord',
    method: 'post',
    data
  })
}
export function updatePointStopRecord(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/point/updatePointStopRecord',
    method: 'post',
    data
  })
}
export function exportExamResult(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/exportExamResult',
    method: 'post',
    data
  })
}
export function listGasPage(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gas/listGasPage',
    method: 'post',
    data
  })
}
export function saveGas(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gas/saveGas',
    method: 'post',
    data
  })
}
export function updateGas(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gas/updateGas',
    method: 'post',
    data
  })
}
export function removeGas(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/gas/removeGas',
    method: 'post',
    data
  })
}
export function exportInstrument(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/instrument/exportInstrument',
    method: 'post',
    data
  })
}
export function exportStatisticsUserMonthDayPush(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/exam/exportStatisticsUserMonthDayPush',
    method: 'post',
    data
  })
}
export function pagePartReplaceRecord(data) { // 获取所有因子
  return request({
    url: setting.baseUrl + '/partReplace/pagePartReplaceRecord',
    method: 'post',
    data
  })
}
export function exportPartReplaceRecord(data) { // 导出
  return request({
    url: setting.baseUrl + '/partReplace/exportPartReplaceRecord',
    method: 'post',
    data
  })
}
