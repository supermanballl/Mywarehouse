
Component({
  /**
   * Component properties
   */
  properties: {
      text: String,
      showNavBackBtn:{
          type:Boolean,
          value:true
      }
  },

  /**
   * Component initial data
   */
  data: {
      height: ''
  },
  attached: function () {
      // 响应式定义导航栏的高度
      this.setData({
          height: getApp().globalData.statusBarHeight
      })
  },
  /**
   * Component methods
   */
  methods: {
      navigateBackPage: function () {
          wx.navigateBack({
              delta: 1,
          })
      },
  }
})
