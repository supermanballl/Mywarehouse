Page({
  data: {
    html: "",
    img_url: "",
    title: "",
    tpye: 0,
  },
  onLoad(e) {
    console.log(e.id);
    var type = e.id;
    this.setData({
      type,
    });
  },

  onShow(e) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { id } = options;
    var type = id;

    this.setData({
      type,
    });

    console.log(this.data.type);
    var goods_detail = wx.getStorageSync("goods_detail");
    if (this.data.type == 1) {
      var html = goods_detail.data.rich_text;
      var img_url = goods_detail.data.src;
      var title = goods_detail.data.goods_title;
      console.log(html);
      //产品介绍
      this.setData({
        html,
        img_url,
        title,
      });
    } else if (this.data.type == 2) {
      //使用说明
      this.setData({
        html: goods_detail.data.rich_text1,
        img_url: goods_detail.data.src,
        title: goods_detail.data.goods_title,
      });
    } else {
      console.log("没有数据");
    }
  },
  goToDetail: function () {
    console.log(getCurrentPages());
    wx.navigateBack({
      delta: 1,
    });
  },
});
