import { request } from "../../request/index.js";
Page({
  data: {
    goods_price: "", //商品价格
    goods_name: "", //商品名称
    pics: [], //轮播图数据
    goods_introduce: [], //图文详情数据
    isCollect: false,
    openid: "",
    goods_id: "",
    shoucangList: {},
    goodsObj: {
      goods_id: 1,
      pics: [
        {
          pics_id: 1,
          pics_mid: "http://47.92.30.79/images/goods_detail/1.jpg",
        },
        {
          pics_id: 2,
          pics_mid: "http://47.92.30.79/images/goods_detail/2.jpg",
        },
        {
          pics_id: 3,
          pics_mid: "http://47.92.30.79/images/goods_detail/3.jpg",
        },
        {
          pics_id: 4,
          pics_mid: "http://47.92.30.79/images/goods_detail/4.jpg",
        },
      ],
      goods_price: "100",
      goods_name: "透视速诊",
      goods_introduce: [
        {
          pics_mid: "http://47.92.30.79/images/goods_detail/1.jpg",
        },
        {
          pics_mid: "http://47.92.30.79/images/goods_detail/2.jpg",
        },
        {
          pics_mid: "http://47.92.30.79/images/goods_detail/3.jpg",
        },
        {
          pics_mid: "http://47.92.30.79/images/goods_detail/4.jpg",
        },
      ],
      //商品是否被收藏
      isCollect: false,
      //商品是否被加入购物车
      isCart: false,
    },
    isDianzan: false,
  },

  onShow: function () {
    let openid = wx.getStorageSync("openid") || [];
    this.setData({
      openid,
    });
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.setData({
      goods_id,
    });
    this.getGoodsDetail(goods_id);
    //根据点击的商品id查询数据库该商品的详细信息
    var reqTask = wx.request({
      url: "http://47.92.30.79:82/home/GoodsListById",
      data: {
        goods_id: goods_id,
        openid: openid.data,
      },
      header: { "content-type": "application/json" },
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result.data.data[0]);
        //商品信息存入内存
        wx.setStorageSync("goods_detail", { data: result.data.data[0] });
        //分离数据
        var lunboimgs = result.data.data[0].lunboimgs.split(",");

        var tuwenxqimgs = result.data.data[0].tuwenxqimgs.split(",");
        this.setData({
          goods_price: result.data.data[0].goods_price,
          goods_name: result.data.data[0].goods_title,
          pics: lunboimgs,
          goods_introduce: tuwenxqimgs,
        });
      },
      fail: (e) => {
        console.log(e);
      },
    });
    //查询该商品是否被该用户收藏
    var reqTask = wx.request({
      url: "http://47.92.30.79:82/home/SelectShoucangList1",
      data: {
        openid: this.data.openid.data,
        goodsid: goods_id,
      },
      header: { "content-type": "application/json" },
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        if (result.data.Data.length == 0) {
          //该用户没有收藏该商品
          this.setData({
            isCollect: false,
            shoucangList: result.data.Data[0],
            goods_id,
          });
        } else {
          //该用户收藏过该商品
          this.setData({
            isCollect: true,
            shoucangList: result.data.Data[0],
            goods_id,
          });
        }
      },
      fail: (e) => {
        console.log(e);
      },
    });
    //查询该商品是否被加入购物车
    this.getCartList(openid.data, goods_id);
    //查询该商品是否被点赞
    this.selectDianzan(openid.data, goods_id);
  },
  async selectDianzan(openid, goodsid) {
    var dianzan = await request({
      url: "GetDianzanListByid",
      data: { openid, goodsid },
    });
    console.log(dianzan);
    console.log(dianzan.data.Data.length);
    var isDianzan = false;
    if (dianzan.data.Data.length > 0) {
      isDianzan = true;
    }
    this.setData({
      isDianzan,
    });
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {},

  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.data.pics;
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },
  /* 实现控制中间凸显图片的样式 */
  handleChangeTwo: function (e) {
    this.setData({
      currentIndex4: e.detail.current,
    });
    console.log(this.data.currentIndex4);
  },

  // 点击 加入购物车
  handleCartAdd() {
    /**
     * 1.数据库查询购物车数组该用户购物车中是否有该商品
     */
    var that = this;
    var openid = this.data.openid.data;
    var goods_id = this.data.goods_id;
    this.getCartList(openid, goods_id);
    var isCart = this.data.isCart;
    if (isCart) {
      wx.showModal({
        title: "提示",
        content: "该商品已加入购物车！",
      });
    } else {
      that.addCartList(openid, goods_id);
      wx.showModal({
        title: "提示",
        content: "加入购物车成功",
      });
    }
  },
  async getCartList(openid, goods_id) {
    var cartList = await request({
      url: "SelectCartList1",
      data: { openid, goods_id },
    });
    if (cartList.data.Data.length != 0) {
      //当前商品已经被加入购物车
      this.setData({
        isCart: true,
      });
      //console.log(this.data.isCart);
    }
  },
  async addCartList(openid, goods_id) {
    var cartList = await request({
      url: "AddCart",
      data: { openid, goods_id },
    });
  },

  // 点击商品收藏图标
  handleCollect() {
    console.log(this.data.shoucangList);
    /*
    1.获取数据库中的收藏商品数据
    2.点击收藏按钮后isCollect取反并更新数据库
    */
    if (this.data.isCollect) {
      console.log(this.data.shoucangList);
      //取消收藏
      var reqTask1 = wx.request({
        url: "http://47.92.30.79:82/home/DelShoucangList",
        data: {
          shoucang_id: this.data.shoucangList.shoucang_id,
        },
        header: { "content-type": "application/json" },
        method: "GET",
        dataType: "json",
        responseType: "text",
        success: (result) => {
          console.log(result.data.Data);
          wx.showToast({
            title: "取消收藏",
            icon: "success",
            mask: true,
          });
          this.setData({
            isCollect: false,
          });
        },
      });
    } else {
      //添加收藏信息
      var reqTask1 = wx.request({
        url: "http://47.92.30.79:82/home/AddShoucangList",
        data: {
          openid: this.data.openid.data,
          goods_id: this.data.goods_id,
        },
        header: { "content-type": "application/json" },
        method: "GET",
        dataType: "json",
        responseType: "text",
        success: (result) => {
          console.log(result);
          wx.showToast({
            title: "收藏成功",
            icon: "success",
            mask: true,
          });
          this.setData({
            shoucangList: result.data.Data,
            isCollect: true,
          });
        },
      });
    }
  },

  //点击商品点赞图标
  handledianzan() {
    var openid = this.data.openid.data;
    var goods_id = this.data.goods_id;
    if (this.data.isDianzan) {
      //取消收藏
      this.DelDianzan(openid, goods_id);
    } else {
      //添加收藏信息
      this.AddDianzan(openid, goods_id);
    }
  },
  //取消点赞
  async DelDianzan(openid, goods_id) {
    var DZ_id = await request({
      url: "GetDianzanID",
      data: { goods_id, openid },
    });
    var id = DZ_id.data;
    console.log(DZ_id.data);
    var del = await request({
      url: "DelDianzanList",
      data: { id },
    });
    console.log(del);
    this.setData({
      isDianzan: false,
    });
  },
  //添加点赞
  async AddDianzan(openid, goods_id) {
    var add = await request({
      url: "AddDianzanList",
      data: { openid, goods_id },
    });
    this.setData({
      isDianzan: true,
    });
  },

  handlepay: function () {
    wx.navigateTo({
      url: "/pages/payDetail/index?goods_id=" + this.data.goods_id,
    });
  },

  //超链接到购物车
  goToCart: function (e) {
    wx.switchTab({
      url: "/pages/cart/index",
    });
  },
  goToIntroduce: function (e) {
    //console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url:
        "/pages/goods_detail/introduce/index?id=" + e.currentTarget.dataset.id,
    });
  },

  onShareAppMessage: function (res) {
    console.log(res.target.dataset.id);
    var goods_id = res.target.dataset.id;
    var openid = this.data.openid.data;
    var goods_name = this.data.goods_name;
    var title = this.data.goods_name + "分享页面";
    this.AddShareList(openid, goods_id);
    console.log(456465);
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: title,
        });
      }, 100);
    });
    return {
      title: title,
      path: "/page/user?id=123",
      promise,
      success: function (res) {},
    };
  },
  //加入分享列表
  async AddShareList(openid, goods_id) {
    var add = await request({
      url: "AddShareList",
      data: { openid, goods_id },
    });
    console.log(add);
  },
});
