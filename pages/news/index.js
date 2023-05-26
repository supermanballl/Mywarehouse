import { request1 } from "../../request/index.js";
Page({
  data: {
    newsList: [],
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    callbackcount: 5, //返回数据的个数
  },
  onLoad: function () {
    this.getNewsList(1);
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    wx.showToast({
      title: "没有更多数据了",
    });
  },

  async getNewsList(i) {
    var u =
      "https://www.mxnzp.com/api/news/list?typeId=516&page=" +
      i +
      "&app_id=qemppzeormikomhp&app_secret=R2V4SlJtbVRMaG1RNWVBUVF5R0RZZz09";
    const newsList = await request1({ url: u });
    this.setData({
      newsList: newsList.data.data,
    });
    console.log(newsList.data.data);
  },
  goToNewsDetail: function (e) {
    const newsid = e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: "../news/new_detail/index?newsid=" + newsid,
    });
  },
});
