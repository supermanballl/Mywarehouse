import { request } from "../../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    yesAddress: true, //判断是否有收货地址
  },

  onShow() {
    //数据库获取地址信息
    const openid = wx.getStorageSync("openid") || [];
    var addAddress = this.data.addAddress;
    //数据库保存数据
    this.getAddress();

    //手机号脱敏
    var address = this.data.address;
    for (var i = 0; i < address.length; i++) {
      if (address[i].phone.length == 11) {
        address[i].phone =
          address[i].phone.substring(0, 3) + "****" + phone.substring(7);
      }
    }
    this.setData({
      address,
    });
  },

  async getAddress() {
    const openid = wx.getStorageSync("openid") || [];
    var address = await request({
      url: "SelectAddressList",
      data: { openid: openid.data },
    });
    this.setData({
      address: address.data.Data,
    });
    console.log(this.data.address);
  },

  isChoose: function (e) {
    var addressid = e.currentTarget.dataset.id;
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({
      addressid: addressid,
    });
    console.log(e);
    wx.navigateBack({
      delta: 1,
    });
  },
});
