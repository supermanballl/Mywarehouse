import { request } from "../../request/index.js";
const App = getApp();
Page({
  data: {
    list: [],
    flag: true, //判断是否有收藏数据
  },
  onShow() {
    let openid = wx.getStorageSync("openid") || [];
    this.setData({
      openid,
    });
    this.getGoodsList();
  },
  //查询收藏数据，根据数据查询商品信息
  async getGoodsList() {
    var list = [];
    var openid = this.data.openid.data;
    var shoucanglist = await request({
      url: "SelectShoucangList",
      data: { openid },
    });
    for (var i = 0; i < shoucanglist.data.Data.length; i++) {
      var goods_id = shoucanglist.data.Data[i].goods_id;
      var goodsObj = await request({
        url: "GoodsListById",
        data: { goods_id },
      });
      console.log(goodsObj);
      list[i] = goodsObj.data.data[0];
    }
    console.log(list);
    if (list.length == 0) {
      var flag = false;
      this.setData({
        flag,
      });
    }
    this.setData({
      list,
    });
  },

  // 删除
  delList: function (e) {
    var that = this;
    var goodsid = e.currentTarget.dataset.id; // 当前下标
    var openid = this.data.openid.data;
    wx.showModal({
      title: "删除",
      content: "确认删除该收藏？",
      success(res) {
        that.requestForDel(goodsid, openid);
      },
    });
    this.onShow();
  },

  async requestForDel(goodsid, openid) {
    var shoucanglist = await request({
      url: "SelectShoucangList1",
      data: { goodsid, openid },
    });
    console.log(shoucanglist);
    var shoucang_id = shoucanglist.data.Data[0].shoucang_id;
    var result = await request({
      url: "DelShoucangList",
      data: { shoucang_id },
    });
    this.getGoodsList();
    this.setData({
      delResult: result.data.Data,
    });
  },

  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = App.touch._touchstart(e, this.data.list); //将修改过的list setData
    this.setData({
      list: data,
    });
  },

  //滑动事件处理
  touchmove: function (e) {
    console.log();
    let data = App.touch._touchmove(e, this.data.list, "goods_id"); //将修改过的list setData
    this.setData({
      list: data,
    });
  },
});
