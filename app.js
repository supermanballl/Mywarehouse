// app.js
import touch from './utils/touch.js'//新加
require('./common/runtime.js')
require('./common/vendor.js')
require('./common/main.js')
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取系统关键数据
    wx.getSystemInfo({
      success: (res) => {
        // 响应式获取微信顶部状态栏高度
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    })
  },
  globalData: {
    userInfo: null
	},
	touch: new touch() //实例化这个touch对象
})
