Component({
  data: {
    fee: 1,             // 支付金额，单位为分
    paymentArgs: 'A', // 将传递到功能页函数的自定义参数
    currencyType: 'USD', // 货币符号，页面显示货币简写 US$ 
    version: 'develop', // 上线时，version 应改为 "release"，并确保插件所有者小程序已经发布
  },
  methods: {
    goPay() { // 支付
      const openId = wx.getStorageSync("code") // 获取微信的code作为open ID传到后台
      console.log(openId)
      // payType后台规定的支付方式，orderId 订单id
      http.postRequest('调后台的支付接口', { payType: 2, orderId: this.data.detail.id, code: openId },
        (res) => {
          if (res && res.code == 1) {
            var _r = res.data
            wx.requestPayment({ //调起支付
              'timeStamp': _r.timeStamp,
              'nonceStr': _r.nonceStr,
              'package': _r.packageValue,
              'signType': _r.signType,
              'paySign': _r.paySign,
              'success': function (res) { // 接口调用成功的回调函数
                console.log(res);
                //TODO  跳转订单
                wx.navigateTo({
                  url: '/pages/myOrder/myOrder?type=1&list=2',
                })
              },
              'fail': function (res) { // 接口调用失败的回调函数
                console.log('fail:' + JSON.stringify(res));
              }
            })
          }
        },
        (err) => {
          console.log(err);
        });
    },
  
  }
})
