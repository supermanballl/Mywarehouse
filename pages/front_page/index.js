Page({
  data: {
    //轮播图数据
    fileList: [
      {
        id: 1,
        img_url: "http://47.92.30.79/images/front_page/list_img1.png",
      },
      {
        id: 2,
        img_url: "http://47.92.30.79/images/front_page/list_img1.png",
      },
      {
        id: 1,
        img_url: "http://47.92.30.79/images/front_page/list_img1.png",
      },
    ],
    //商品数据
    goods: [],
    goods1: [],
    //新闻数据
    news: {},
    video: {
      src: "http://47.92.30.79/1.MP4",
      title: "透目速诊",
      time: "2020-01-01",
      text: "通过观察眼睛来诊断全身疾病的一种诊法",
    },
  },
  onLoad: function (options) {
    //数据库查询获取商品列表
    wx.request({
      url: "http://47.92.30.79:82/home/GoodsAllList",
      data: {},
      method: "GET",
      dataType: "json",
      success: (result) => {
        var res = result.data.data;
        var arr = [];
        var arr1 = [];
        var x = 0;
        var y = 0;
        for (var i = 0; i < res.length; i++) {
          var z = res.length / 2;
          console.log(z);
          if (i < z) {
            arr[x] = res[i];
            x++;
          } else {
            arr1[y] = res[i];
            y++;
          }
        }
        this.setData({
          goods: arr,
          goods1: arr1,
        });
        wx.setStorageSync("goods", { data: result.data.Data });
        console.log(this.data.goods);
      },
      fail: (e) => {
        console.log(e);
      },
    });
  },
  onShow: function () {
    this.getNews();
    getOpenId();
  },
  //获取新闻数据
  getNews: function (e) {
    var that = this;
    var u =
      " https://www.mxnzp.com/api/news/list?typeId=509&page=1&app_id=" +
      this.data.APP_ID +
      "&app_secret=" +
      this.data.APP_SECRET;
    wx.request({
      url: "https://www.mxnzp.com/api/news/list?typeId=516&page=1&app_id=qemppzeormikomhp&app_secret=R2V4SlJtbVRMaG1RNWVBUVF5R0RZZz09",
      data: {},
      method: "GET",
      dataType: "json",
      success: (result) => {
        that.setData({
          news: result.data.data,
        });
        console.log(this.data.news);
      },
      fail: (e) => {
        console.log(e);
      },
      complete: () => {},
    });
  },
  goToNewsDetail: function (e) {
    var newsid = e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: "/pages/news/new_detail/index?newsid=" + newsid,
    });
  },
  frontToCart: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods_detail/index?goods_id=" + goods_id,
    });
  },
  goToNation_treat: function (e) {
    wx.switchTab({
      url: "/pages/nation_treat/index",
    });
  },
  goToP_video: function (e) {
    wx.navigateTo({
      url: "/pages/p_video/index",
    });
  },
  goToYanngsheng: function (e) {
    wx.navigateTo({
      url: "/pages/yangsheng/index",
    });
  },
  goToSearch: function (e) {
    wx.navigateTo({
      url: "/pages/search/index",
    });
  },
  goToNews: function (e) {
    wx.navigateTo({
      url: "/pages/news/index",
    });
  },
  goToLXWM: function () {
    wx.navigateTo({
      url: "/pages/feedback/index",
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
