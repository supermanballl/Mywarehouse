Page({

  data: {
    payImg:"http://47.92.30.79/images/user/微信支付二维码.jpg",
    ddlist:[],

  },

  onShow() {
    //获取订单数组
    let ddlist=wx.getStorageSync("ddlist");
    console.log(ddlist);
    this.setData({
      ddlist
    })
  },
   gotoDD:function(){
    console.log(5555)
    wx.navigateTo({
      url: '/pages/user/order/index?id='+0,
    })
      
  }

})