module.exports = {

  title: '海晟运维管理系统',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
  // baseUrl: process.env.NODE_ENV === 'development' ? 'http://47.98.163.147:9999/haisheng' : 'https://operate.sea-splendor.com/haisheng'
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://192.168.2.44:9003/haisheng' : 'https://operate.sea-splendor.com/haisheng'
}
