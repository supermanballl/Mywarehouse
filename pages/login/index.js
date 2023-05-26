import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isfingerPrint: false, //可否使用指纹识别  默认false
    openid: "",
  },
  //获取用户登录信息
  getUserProfile(e) {
    var that = this;
    var boole = this.data.isfingerPrint;
    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        for (var i in res.supportMode) {
          if (res.supportMode[i] == "fingerPrint") {
            console.log("支持指纹识别", res.supportMode[i]);
            wx.startSoterAuthentication({
              requestAuthModes: ["fingerPrint"],
              challenge: "123456",
              authContent: "请用指纹",
              success(res) {
                console.log("识别成功", res);
                wx.showModal({
                  title: "提示",
                  content: "识别成功",
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      getOpenId();
                      getUserMessage();
                    }
                  },
                });
              },
              fail(res) {
                console.log("识别失败", res);
                show("提示", "识别失败", false);
              },
            });
          } else {
            show("提示", "不支持识别", false);
          }
        }
      },
      fail(res) {
        getOpenId();
        getUserMessage();

        console.log("不支持识别", res);
      },
    });
  },
});

function getOpenId() {
  var that = this;
  wx.login({
    success(res) {
      console.log("code====", res.code);
      wx.request({
        url: "https://api.weixin.qq.com/sns/jscode2session",
        data: {
          appid: "wx61d198560ad9261b",
          secret: "c1a872271bb6dbc4b7c86d55cd75e1ed",
          js_code: res.code,
          grant_type: "authorization_code",
        },
        method: "GET",
        success(res) {
          //console.log('openid=====',res.data.openid);   // 得到openid
          var openid = res.data.openid;
          // openid存入到本地存储中
          wx.setStorageSync("openid", { data: openid });
          //用户openid存入数据库
        },
      });
    },
  });
}

//获取用户信息
function getUserMessage() {
  console.log(123);
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  wx.getUserProfile({
    desc: "用于完善资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      const { userInfo } = res;
      console.log(userInfo);
      wx.setStorageSync("userinfo", userInfo);
      addUser();
      //   wx.navigateBack({
      //     //Home/AddUserList
      //     delta: 1,
      //     // data:this.data.openid
      //   });
    },
  });
}

async function addUser() {
  var openid = wx.getStorageSync("openid").data;
  var userinfo = wx.getStorageSync("userinfo");
  var wxname = userinfo.nickName;
  var img = userinfo.avatarUrl;
  var adduserlist = await request({
    url: "AddWXUser",
    data: { openid, wxname, img },
  });
  console.log(adduserlist);
}

function show(tit, msg, q, succ, fail) {
  wx.showModal({
    title: tit,
    content: msg,
    showCancel: q,
    success: function (res) {
      if (res.confirm) {
        if (succ) {
          succ();
        }
      } else if (res.cancel) {
        if (fail) {
          fail();
        }
      }
    },
  });
}
