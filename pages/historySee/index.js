import { request } from "../../request/index.js";
const App = getApp();
Page({
  data: {
    openid: "",
    list: [],
    history: [],
    flag: true, //判断是否有收藏数据
    allcheck: false, //全选判断
    count: 0,
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
    var list = this.data.list;
    var history = this.data.history;
    var timeList = [];
    var openid = this.data.openid.data;
    var shoucanglist = await request({
      url: "SelectHistoryList",
      data: { openid },
    });
    console.log(shoucanglist);
    for (var i = 0; i < shoucanglist.data.Data.length; i++) {
      var goods_id = shoucanglist.data.Data[i].goods_id;
      var goodsObj = await request({
        url: "GoodsListById",
        data: { goods_id },
      });
      console.log(goodsObj);
      //1.根据日期区分是否为同一数组
      var time = shoucanglist.data.Data[i].see_time;
      var x = this.timestampToTime(time).replace(new RegExp("/", "g"), "-");
      timeList[i] = x;
    }
    var timeList1 = Array.from(new Set(timeList)); //数组去重

    console.log(timeList1);
    for (var i = 0; i < timeList1.length; i++) {
      //根据日期查历史浏览数据
      var date = timeList1[i];
      var shoucanglist1 = await request({
        url: "SelectHistoryListByDate",
        data: { date },
      });
      //list[i].time=date;
      var time = "list[" + i + "].time"; //0是数组取值第一的
      this.setData({
        [time]: date,
      });
      console.log(shoucanglist1.data.Data);
      var length = shoucanglist1.data.Data.length;
      for (var j = 0; j < length; j++) {
        //根据历史浏览数据查商品数据
        var goods_id = shoucanglist1.data.Data[j].goods_id;
        var goodsObj = await request({
          url: "GoodsListById",
          data: { goods_id },
        });
        var history = "list[" + i + "].history[" + j + "]"; //0是数组取值第一的
        var checked = "list[" + i + "].history[" + j + "].checked";
        this.setData({
          [history]: goodsObj.data.data[0],
          [checked]: false,
        });
      }
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

  handeItemChange: function (e) {
    var count = 0;
    var goods_id = e.currentTarget.dataset.id;
    var list = this.data.list;
    var allcheck = this.data.allcheck;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].history.length; j++) {
        if (goods_id === list[i].history[j].goods_id) {
          list[i].history[j].checked = !list[i].history[j].checked;
        }
      }
    }
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].history.length; j++) {
        if (list[i].history[j].checked) {
          count++;
        }
      }
    }
    this.setData({
      list,
      allcheck,
      count,
    });
    console.log(allcheck);
  },
  handleItemAllCheck: function (e) {
    var count = 0;
    var list = this.data.list;
    var allcheck = !this.data.allcheck;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].history.length; j++) {
        list[i].history[j].checked = allcheck;
        count++;
      }
    }
    if (!allcheck) {
      count = 0;
    }
    this.setData({
      list,
      allcheck,
      count,
    });
  },
  // 删除
  handleDel: function (e) {
    var count = this.data.count;
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除该" + count + "项记录吗？",
      success: function (res) {
        if (res.confirm) {
          //这里是点击了确定以后
          var list = that.data.list;
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i].history.length; j++) {
              if (!that.data.allcheck) {
                if (list[i].history[j].checked) {
                  //删除该商品记录
                  var goods_id = list[i].history[j].goods_id;
                  console.log(goods_id);
                  var openid = that.data.openid.data;
                  that.requestForDel(goods_id, openid);
                }
              } else {
                var goods_id = list[i].history[j].goods_id;
                var openid = that.data.openid.data;
                that.requestForDel(goods_id, openid);
              }
            }
          }
          //显示加载界面
          wx.showLoading({
            // 显示加载中loading效果
            title: "加载中",
            mask: true, //开启蒙版遮罩
          });
          that.setData({
            list: [],
          });
          that.onShow();
          //隐藏加载界面
          wx.hideLoading();
        } else {
          //这里是点击了取消以后
          console.log("用户点击取消");
        }
      },
    });
  },

  async requestForDel(goods_id, openid) {
    var result = await request({
      url: "DelHistoryList",
      data: { goods_id, openid },
    });
    console.log(result);
    this.getGoodsList();
    this.setData({
      delResult: result.data.Data,
    });
  },
  //时间戳转换
  timestampToTime(timestamp) {
    return new Date(parseInt(timestamp.substring(6, 19)))
      .toLocaleDateString()
      .replace(/:\d{1,2}$/, " "); //年月日，toLocaleString()：年月日时分秒
  },
  gotoDetail: function (e) {
    console.log(e.currentTarget.dataset.id);
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods_detail/index?goods_id=" + goods_id,
    });
  },
});
