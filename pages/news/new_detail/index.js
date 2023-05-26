import { request1 } from "../../../request/index.js";
Page({
  data: {
    model: {},
    loading: true,
    newsdetail: {},
  },
  onLoad: function (options) {
    var newsid = options.newsid;
    var u =
      "https://www.mxnzp.com/api/news/details?newsId=" +
      newsid +
      "&app_id=qemppzeormikomhp&app_secret=R2V4SlJtbVRMaG1RNWVBUVF5R0RZZz09";
    this.getNewsDetail(u);
  },
  async getNewsDetail(u) {
    const newsList = await request1({ url: u });
    this.setData({
      newsdetail: newsList.data.data,
    });
  },
});
