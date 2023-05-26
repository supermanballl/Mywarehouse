const key = "ZHIBZ-V3DCF-BBAJS-J4LHB-5JXVE-KMBDN"; // 使用在腾讯位置服务申请的key
const referer = "果帕雅微信小程序"; // 调用插件的app的名称
const hotCitys = "昆明"; // 用户自定义的的热门城市

var startPoint;
//const db = wx.cloud.database()//必须有
Page({
  data: {
    address: [
      {
        id: "1",
        openid: "",
        province: "",
        city: "",
        district: "",
        name: "",
        phone: "",
        remark: "",
      },
    ],
    yesAddress: true, //判断是否有收货地址
    //按钮位置参数
    top: 768, //实时相对上边界距离
    left: 650, //实时相对于左边界的距离
    windowHeight: "",
    windowWidth: "", //窗口宽高
    height: 100,
    width: 100, //按钮宽高
    timer: null, //定时器
    iSpeedX: 0, //x方向速度
    iSpeedY: 0, //y方向速度
    b: 0.0, //px转rpx比例（机型不同比例不同）
    lastX: 0, //上一次位置参数
    lastY: 0, //
    degreesXY: 0, //手机水平角度
    rotateXY: 0,
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        var b = res.windowWidth / 750;
        this.setData({
          b,
          windowWidth: res.windowWidth / b, //320px->rpx
          windowHeight: res.windowHeight / b, //456px->rpx
        });
        console.log("高：", this.data.windowHeight);
      },
    });
    this.startMove();
  },

  onShow() {
    //数据库获取地址信息
    const openid = wx.getStorageSync("openid") || [];
    var addAddress = this.data.addAddress;
    //数据库保存数据
    var reqTask = wx.request({
      url: "http://47.92.30.79:82/home/SelectAddressList",
      data: {
        openid: openid.data,
      },
      header: { "content-type": "application/json" },
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result.data.Data);
        this.setData({
          address: result.data.Data,
        });
      },
      fail: (e) => {
        console.log(e);
      },
    });
    //手机号脱敏
    var address = this.data.address;
    // for (var i = 0; i < address.length; i++) {
    //   console.log(address[i]);
    //   if (address[i].phone.length == 11) {
    //     address[i].phone =
    //       address[i].phone.substring(0, 3) + "****" + phone.substring(7);
    //   }
    // }
    this.setData({
      address,
    });
  },
  btn_Edit: function (e) {
    var addressid = e.currentTarget.dataset.addressid;
    wx.navigateTo({
      url: "/pages/setup/addressEdit1/index?addressid=" + addressid,
    });
  },

  btn_click: function () {
    wx.navigateTo({
      url: "/pages/setup/addressEdit1/index",
      events: {
        changeData: function (data) {
          console.log("changeData", data);
        },
      },
    });
    // wx.navigateTo({
    //   url: '/pages/setup/addressEdit/index',
    // })
  },

  startMove: function () {
    var timer;
    var iSpeedY = this.data.iSpeedY;
    var iSpeedX = this.data.iSpeedX;
    var that = this;
    var isX = 0;
    var isY = 0;

    clearInterval(timer);
    timer = setInterval(function () {
      //将Y轴增加速度，实现重力运动
      iSpeedY += 3;
      that.setData({
        top: that.data.top + iSpeedY,
        left: that.data.left + iSpeedX,
      });

      //当元素碰到底边时
      if (that.data.top >= that.data.windowHeight - 100) {
        //速度递减
        iSpeedY *= -0.5;
        iSpeedX *= 0.5;
        //误差强行赋值
        that.setData({
          top: that.data.windowHeight - 100,
        });
        //当元素碰到上边时
      } else if (that.data.top <= 0) {
        //速度递减
        iSpeedY *= -0.5;
        iSpeedX *= 0.5;
        //误差强行赋值
        that.setData({
          top: 0,
        });
      }

      //当元素碰到右边时
      if (that.data.left >= that.data.windowWidth - 100) {
        //速度递减
        iSpeedX *= -0.5;
        //误差强行赋值
        that.data.left = that.data.windowWidth - 100;
        //当元素碰到左边时
      } else if (that.data.left <= 0) {
        //速度递减
        iSpeedX *= -0.5;
        //误差强行赋值
        that.data.left = 0;
      }

      //当X轴的速度绝对值小于0时
      if (iSpeedX < 0) isX = -1 * iSpeedX;
      else isX = iSpeedX;
      if (isX < 1) {
        //强行终止
        iSpeedX = 0;
      }

      //当Y轴的速度绝对值小于0时
      if (iSpeedY < 0) isY = -1 * iSpeedY;
      else isY = iSpeedY;
      if (isY < 2) {
        //强行终止
        iSpeedY = 0;
      }

      //当速度为零，元素碰到底边时
      if (
        iSpeedX === 0 &&
        iSpeedY === 0 &&
        that.data.top === that.data.windowHeight - 100
      ) {
        clearInterval(timer);
        console.log(666);
      } else {
        that.setData({
          top: that.data.top + iSpeedY,
          left: that.data.left + iSpeedX,
        });
      }
    }, 50);
  },

  buttonStart: function (e) {
    startPoint = e.touches[0]; //获取拖动开始点
    // console.log(startPoint=e.touches[0])
  },

  buttonMove: function (e) {
    var endPoint = e.touches[e.touches.length - 1]; //获取拖动结束点
    // console.log(endPoint);
    var buttonTop = endPoint.clientY / this.data.b;
    var buttonLeft = endPoint.clientX / this.data.b;
    if (buttonLeft + 100 >= this.data.windowWidth) {
      buttonLeft = this.data.windowWidth - 100;
    }
    if (buttonLeft <= 0) {
      buttonLeft = 0;
    }
    if (buttonTop <= 0) {
      buttonTop = 0;
    }
    if (buttonTop + 100 >= this.data.windowHeight) {
      buttonTop = this.data.windowHeight - 100;
    }
    this.setData({
      top: buttonTop,
      left: buttonLeft,
    });
    this.setData({
      iSpeedX: this.data.left - this.data.lastX,
      iSpeedY: this.data.top - this.data.lastY,
    });
    //更新当前点，方便下次计算
    this.setData({
      lastX: this.data.left,
      lastY: this.data.top,
    });
  },
  buttonEnd: function (e) {
    this.startMove();
  },
});
