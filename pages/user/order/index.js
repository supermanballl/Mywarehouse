import { request } from "../../../request/index.js";
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    front_page0: [], //空数组，获取到云数据库的数据存放其中
    front_page1: [],
    front_page2: [],
    front_page3: [],
    length: 0,
    id: -1,
    openid: "",
    userddlist: [],
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    tabheight: [],
  },

  onLoad: function (options) {
    let { id } = options;
    this.setData({ id });
    this.setData({
      currentTab: id,
    });
    this.checkCor();
    let openid = wx.getStorageSync("openid") || [];
    this.setData({
      openid,
    });
    this.getUserDdList();
    console.log(this.data.userddlist);
  },

  onShow: function () {
    this.getUserDdList();
    var userddlist = this.data.userddlist;

    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    for (var i = 0; i < userddlist.length; i++) {
      if (userddlist[i].status == 2) {
        //待付款
        b++;
      } else if (userddlist[i].status == "1") {
        //待发货
        a++;
      } else if (userddlist[i].status == 3) {
        //待收
        c++;
      } else if (userddlist[i].status == 4) {
        //退换
        d++;
      }
    }
    console.log(a);
    var list1 = [];
    var list2 = new Array(b);
    var list3 = new Array(c);
    var list4 = new Array(d);
    var ai = 0;
    var bi = 0;
    var ci = 0;
    var di = 0;

    for (var i = 0; i < userddlist.length; i++) {
      console.log(userddlist[i]);
      if (userddlist[i].status == 2) {
        //待付款
        list2[bi] = userddlist[i];
        bi++;
      } else if (userddlist[i].status == 1) {
        //待发货
        list1[ai] = userddlist[i];
        ai++;
      } else if (userddlist[i].status == 3) {
        //待收货
        list3[ci] = userddlist[i];
        ci++;
      } else if (userddlist[i].status == 4) {
        //退换
        list4[di] = userddlist[i];
        di++;
      }
    }
    console.log(list1);
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
    });
    //console.log(e.detail.current);
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      });
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
      this.setData({
        scrollLeft: 300,
      });
    } else {
      this.setData({
        scrollLeft: 0,
      });
    }
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
    console.log(userddlist.length);
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var list1 = [];
    var list2 = [];
    var list3 = [];
    var list4 = [];
    console.log(userddlist);
    for (var i = 0; i < userddlist.length; i++) {
      //1.根据地址id获取地址信息
      var addressid = userddlist[i].address_id;
      var address = await request({
        url: "SingleAddress",
        data: { addressid },
      });
      console.log(address.data.Data[0].city);
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
    var tabheight = [];
    for (var i = 0; i < 5; i++) {
      if (i == 0) {
        tabheight[i] = 720 * userddlist.length;
      } else if (i == 1) {
        tabheight[i] = 720 * list1.length;
      } else if (i == 2) {
        tabheight[i] = 720 * list2.length;
      } else if (i == 3) {
        tabheight[i] = 720 * list3.length;
      } else if (i == 4) {
        tabheight[i] = 720 * list4.length;
      }
    }

    this.setData({
      list1,
      list2,
      list3,
      list4,
      userddlist,
      tabheight,
    });
    console.log(list4.length);
  },
});
