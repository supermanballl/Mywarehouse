import { showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    max: 200, //限制最大输入字符数
    min: 10, //限制最小输入字符数
    minWord: "", //提示语句
    remark: "暂无备注",
    num: 1, //商品数量
    payList: [], //支付数组
    openid: "",
    allprice: 0, //支付总价
    goods_id: "", //当前操作的商品对象的goods_id
    editText: "",
    addressid: "0",
    address: {},
    goods_idList: "",
  },

  onShow() {
    console.log(4646465);

    let openid = wx.getStorageSync("openid") || [];
    this.setData({
      openid,
    });
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    var addressid = this.data.addressid;
    if (addressid != "0") {
      //查询地址
      console.log("**************");
      this.selectaddress(addressid);
      console.log(this.data.address);
    } else {
      console.log("+++++++++++++++++++++++");
      this.getisDefaultAddress();
      console.log(this.data.addressid);
    }
    console.log(this.data.addressid);
    const { goods_id, goods_idList } = options;
    console.log(goods_idList);
    this.setData({
      goods_idList,
    });
    if (goods_idList != undefined) {
      //购物车跳转
      let strs = goods_idList.split(",");
      this.selectPay(strs);
    } else if (goods_id != undefined) {
      //商品详情页面跳转
      this.selectPay1(goods_id);
    }
  },
  chooseAddress: function (e) {
    wx.navigateTo({
      url: "/pages/payDetail/addressChoose/index",
    });
  },

  async getisDefaultAddress() {
    var openid = this.data.openid.data;
    var address = await request({
      url: "GetisDefaultAddress",
      data: { openid },
    });
    console.log(address.data.Data[0]);
    this.setData({
      address: address.data.Data[0],
      addressid: address.data.Data[0].addressid,
    });
    console.log(this.data.addressid);
  },

  // 商品查询
  async selectPay(goods_idList) {
    var openid = this.data.openid.data;
    var payList = [];
    var allprice = 0;
    for (var i = 0; i < goods_idList.length; i++) {
      var goods_id = goods_idList[i];
      var cartList = await request({
        url: "SelectCartList1",
        data: { openid, goods_id },
      });
      console.log(cartList);
      var goodsList = await request({
        url: "GoodsListById",
        data: { goods_id },
      });
      payList[i] = { ...cartList.data.Data[0], ...goodsList.data.data[0] };
      allprice += payList[i].goods_price * payList[i].cart_num;
    }
    console.log(payList);
    this.setData({
      payList,
      allprice: allprice.toFixed(2),
    });
    for (var i = 0; i < payList.length; i++) {
      var remark = "payList[" + i + "].remark";
      this.setData({
        [remark]: "暂无备注",
      });
    }
  },
  // 商品查询
  async selectPay1(goods_id) {
    var payList = [];
    var allprice = 0;
    var goodsList = await request({
      url: "GoodsListById",
      data: { goods_id },
    });
    payList[0] = goodsList.data.data[0];
    console.log(payList);
    this.setData({
      payList,
    });
    var remark = "payList[0].remark";
    var cart_num = "payList[0].cart_num";
    this.setData({
      [remark]: "暂无备注",
      [cart_num]: 1,
    });
    this.addPrice();
  },
  async selectaddress(addressid) {
    var address = await request({
      url: "SingleAddress",
      data: { addressid },
    });
    this.setData({
      address: address.data.Data[0],
    });
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    var { operation, id } = e.currentTarget.dataset;
    var goods_id = id;
    var payList = this.data.payList;
    let index = payList.findIndex((v) => v.goods_id === goods_id);
    var num = payList[index].cart_num;
    if (num === 1 && operation === -1) {
      await showToast({ title: "购买数量最少为1" });
    } else {
      num += operation;
    }
    payList[index].cart_num = num;
    this.setData({
      payList,
    });
    this.addPrice();
    console.log(payList);
  },
  //商品总价格计算
  addPrice: function (e) {
    var allprice = 0;
    var payList = this.data.payList;
    for (var i = 0; i < payList.length; i++) {
      allprice += payList[i].goods_price * payList[i].cart_num;
    }
    this.setData({
      allprice: allprice.toFixed(2),
    });
  },

  remarkAdd: function (e) {
    console.log(e);
    var goods_id = e.currentTarget.dataset.id;
    this.bindClose();
    //console.log(this.data.remark);
  },

  btn: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    this.setData({
      goods_id,
    });
    var payList = this.data.payList;
    let index = payList.findIndex((v) => v.goods_id === goods_id);
    var editText = payList[index].remark;
    this.setData({ show: true, editText });
  },
  bindClose: function () {
    this.setData({ show: false });
  },
  bindButtonTap: function (e) {
    console.log(e.detail);
    this.setData({ show: false });
  },
  /****限制字数,计算,赋值 */
  getValueLength: function (e) {
    let value = e.detail.value;
    let len = parseInt(value.length);
    var goods_id = this.data.goods_id;
    var payList = this.data.payList;
    let index = payList.findIndex((v) => v.goods_id === goods_id);
    payList[index].remark = value;
    //最多字数限制
    if (len > 200) return;
    this.setData({
      payList,
      currentWordNumber: len, //当前字数
    });
  },
  goToOrder: function () {
    console.log(this.data.addressid);
    this.addDingDan();
  },
  async addDingDan() {
    if (this.data.goods_idList != undefined) {
      //购物车跳转
      let strs = this.data.goods_idList.split(",");
      var dingdanlist = strs;
      console.log(this.data.addressid);
      for (var i = 0; i < strs.length; i++) {
        var goods_id = this.data.payList[i].goods_id;
        var num = this.data.payList[i].cart_num;
        var userid = this.data.openid.data;
        var address_id = this.data.addressid;
        var remark = this.data.payList[i].remark;
        var allprice = this.data.allprice;
        var dingdan = await request({
          url: "AddDingdanList",
          data: { goods_id, num, userid, address_id, remark, allprice },
        });
        console.log(dingdan);
        dingdanlist[i] = dingdan.data.Data;
      }
      console.log(dingdanlist);
      wx.setStorageSync("ddlist", dingdanlist);
      wx.navigateTo({
        url: "/pages/payDetail/dingdan/index",
      });
    } else if (this.data.goods_id != undefined) {
      //商品详情页面跳转
      var goods_id = this.data.payList[0].goods_id;
      var num = this.data.payList[0].cart_num;
      var userid = this.data.openid.data;
      var address_id = this.data.addressid;
      var remark = this.data.payList[0].remark;
      var allprice = this.data.allprice;
      var dingdan = await request({
        url: "AddDingdanList",
        data: { goods_id, num, userid, address_id, remark, allprice },
      });
      console.log(dingdan.data.Data);
      var dingdanlist = [1];
      dingdanlist[0] = dingdan.data.Data;
      wx.setStorageSync("ddlist", dingdanlist);
      wx.navigateTo({
        url: "/pages/payDetail/dingdan/index",
      });
    }
  },
});
