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
  baseUrl: process.env.NODE_ENV === 'development' ? 'https://operate.sea-splendor.com/haisheng' : 'https://operate.sea-splendor.com/haisheng'
}
