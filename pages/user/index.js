import { request } from "../../request/index.js";
Page({
  data: {
    userinfo: {},
    isfingerPrint: false, //可否使用指纹识别  默认false
    mydingdan_list: {
      daifukuan: 2,
      daifahuo: 3,
      daishouhuo: 1,
      // daipingjia: 1,
      tuihua: 0,
    },
    openid: "",
    num: [],
  },

  onShow() {
    // 获取用户登录情况
    const userinfo = wx.getStorageSync("userinfo");
    const openid = wx.getStorageSync("openid");
    console.log(userinfo);
    this.setData({ userinfo, openid });
    wx.setStorageSync("userinfo", userinfo);
    this.getUserDdList();
  },
  clearAllStorage(e) {
    try {
      wx.clearStorageSync();
    } catch (e) {
      // Do something when catch error
    }
  },

  Login() {
    wx.navigateTo({
      url: "../login/index",
    });
  },

  Shoucang() {
    wx.navigateTo({
      url: "/pages/shouchang/index",
    });
  },
  liulan() {
    wx.navigateTo({
      url: "/pages/historySee/index",
    });
  },
  dianzan() {
    wx.navigateTo({
      url: "/pages/dianzan/index",
    });
  },
  fenxiang() {
    wx.navigateTo({
      url: "/pages/fenxiang/index",
    });
  },
  SetUp() {
    wx.navigateTo({
      url: "/pages/setup/index",
    });
  },
  goToOrder(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: "/pages/user/order/index?id=" + id,
    });
  },
  async getUserDdList() {
    var openid = this.data.openid.data;
    var list = await request({
      url: "GetDingdanListByopenid",
      data: { openid },
    });
    var x = list.data.data;
    this.setData({
      userddlist: x,
    });
    var userddlist = this.data.userddlist;
    console.log(userddlist);
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var list1 = [];
    var list2 = [];
    var list3 = [];
    var list4 = [];
    console.log(userddlist[0].address_id);
    for (var i = 0; i < userddlist.length; i++) {
      //1.根据地址id获取地址信息
      var addressid = userddlist[i].address_id;
      console.log(userddlist[i]);
      var address = await request({
        url: "SingleAddress",
        data: { addressid },
      });
      console.log(address.data);
      userddlist[i].city = address.data.Data[0].city;
      userddlist[i].district = address.data.Data[0].district;
      userddlist[i].province = address.data.Data[0].province;
      userddlist[i].name = address.data.Data[0].name;
      userddlist[i].phone = address.data.Data[0].phone;

      //2.根据商品id获取商品信息
      var goods_id = userddlist[i].goods_id;
      var goods = await request({
        url: "GoodsListById1",
        data: { goods_id },
      });
      console.log(goods);
      userddlist[i].goods_title = goods.data.data[0].goods_title;
      var goods_price = goods.data.data[0].goods_price * userddlist[i].num;
      userddlist[i].price = Number(
        goods_price.toString().match(/^\d+(?:\.\d{0,2})?/)
      );
      userddlist[i].src = goods.data.data[0].src;
      userddlist[i].content = goods.data.data[0].content;

      if (userddlist[i].status == 2) {
        //待付款
        list2[b] = userddlist[i];
        b++;
      } else if (userddlist[i].status == 1) {
        //待发货
        list1[a] = userddlist[i];
        a++;
      } else if (userddlist[i].status == 3) {
        //待收货
        list3[c] = userddlist[i];
        c++;
      } else if (userddlist[i].status == 4) {
        //退换
        list4[d] = userddlist[i];
        d++;
      }
    }
    var mydingdan_list = this.data.mydingdan_list;
    for (var i = 0; i < 5; i++) {
      if (i == 0) {
        mydingdan_list.daifukuan = list1.length;
      } else if (i == 2) {
        mydingdan_list.daifahuo = list2.length;
      } else if (i == 1) {
        mydingdan_list.daishouhuo = list3.length;
      } else if (i == 3) {
        mydingdan_list.tuihua = list4.length;
      }
    }
    this.setData({
      mydingdan_list,
    });
  },
});

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
