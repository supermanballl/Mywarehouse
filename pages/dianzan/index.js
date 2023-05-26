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
    console.log(this.data.list);
  },
  //查询收藏数据，根据数据查询商品信息
  async getGoodsList() {
    var list = [];
    var openid = this.data.openid.data;
    var Dianzanlist = await request({
      url: "GetDianzanListByopenid",
      data: { openid },
    });
    console.log(Dianzanlist.data.data);
    list = Dianzanlist.data.data;
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
    var id = e.currentTarget.dataset.id; // 当前下标

    wx.showModal({
      title: "删除",
      content: "确认删除该点赞记录？",
      success(res) {
        that.requestForDel(id);
      },
    });
    this.onShow();
  },

  async requestForDel(id) {
    var result = await request({
      url: "DelDianzanList",
      data: { id },
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
