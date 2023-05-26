import { request } from "../../request/index.js";
Page({
  data: {
    menu_list: [
      {
        mid: 0,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0541",
        menu_name: "藏医诊疗",
      },
      {
        mid: 1,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0542",
        menu_name: "傣医诊疗",
      },
      {
        mid: 2,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0543",
        menu_name: "蒙古医诊疗",
      },
      {
        mid: 3,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0544",
        menu_name: "维吾尔医诊疗",
      },
      {
        mid: 4,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0545",
        menu_name: "彝医诊疗",
      },
      {
        mid: 5,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0546",
        menu_name: "瑶医诊疗",
      },
      {
        mid: 6,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0547",
        menu_name: "壮医诊疗",
      },
      {
        mid: 7,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0548",
        menu_name: "苗医诊疗",
      },
      {
        mid: 8,
        mzid: "fec2c17b-6c11-49d1-9e6f-7d78230a0549",
        menu_name: "哈尼医诊疗",
      },
    ],
    flag: 0,
    currentTab: 0,
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
        id: 3,
        img_url: "http://47.92.30.79/images/front_page/list_img1.png",
      },
    ],
    Treat_Theory: [
      {
        id: 1,
        title: "四塔理论",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 2,
        title: "“三盘”学说",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 3,
        title: "“雅解”学说",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 4,
        title: "五蕴理论",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
    ],
    Treat_Theory1: [
      {
        id: 1,
        title: "四塔理论",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 2,
        title: "“三盘”学说",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 3,
        title: "“雅解”学说",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 4,
        title: "五蕴理论",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
    ],
    Treat_Theory2: [
      {
        id: 1,
        title: "四塔理论",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 2,
        title: "“三盘”学说",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 3,
        title: "“雅解”学说",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
      {
        id: 4,
        title: "五蕴理论",
        img_url: "http://47.92.30.79/images/nation_treat/cs图片.jpg",
        llid: 1,
      },
    ],
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },
  onShow() {
    this.getLilunxx();
    this.getZhenfa();
    this.getLiaofa();
  },
  switchNavLeft: function (e) {
    //console.log(e);
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id,
      });
    }
    page.setData({
      flag: id,
    });
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e);
    var flag = e.detail.current;
    this.setData({
      currentTab: e.detail.current,
    });
    console.log("当前页数" + e.detail.current);
    this.setData({
      flag,
    });
    this.checkCor();
    this.getLilunxx();
    this.getZhenfa();
    this.getLiaofa();
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    // if (this.data.currentTab>4){
    //   var scrollLeft=this.data.scrollLeft;
    //   this.setData({
    //     scrollLeft:300+scrollLeft
    //   })
    // }else{
    //   this.setData({
    //     scrollLeft:0
    //   })
    // }
  },
  showTheory_ll: function (e) {
    var llid = e.currentTarget.dataset.llid;
    console.log(llid);
    wx.navigateTo({
      url: "/pages/nation_treat/show/index?&llid=" + llid,
    });
  },
  showTheory_zf: function (e) {
    var zfid = e.currentTarget.dataset.zfid;
    console.log(zfid);
    wx.navigateTo({
      url: "/pages/nation_treat/show/index?&zfid=" + zfid,
    });
  },
  showTheory_lf: function (e) {
    var lfid = e.currentTarget.dataset.lfid;
    console.log(lfid);
    wx.navigateTo({
      url: "/pages/nation_treat/show/index?&lfid=" + lfid,
    });
  },
  async getLilunxx() {
    var mzid = this.data.menu_list[this.data.currentTab].mzid;
    console.log(mzid);
    var lilunxxlist = await request({
      url: "GetLilunXXListBymzid",
      data: { mzid },
    });
    console.log(lilunxxlist.data.data);
    wx.setStorageSync("Treat_Theory", { data: lilunxxlist.data.data });
    this.setData({
      Treat_Theory: lilunxxlist.data.data,
    });
  },
  async getZhenfa() {
    var mzid = this.data.menu_list[this.data.currentTab].mzid;
    console.log(mzid);
    var Zhenfalist = await request({
      url: "GetZhenfaListBymzid",
      data: { mzid },
    });
    wx.setStorageSync("Treat_Theory1", { data: Zhenfalist.data.data });
    console.log(Zhenfalist.data.data);
    this.setData({
      Treat_Theory1: Zhenfalist.data.data,
    });
  },
  async getLiaofa() {
    var mzid = this.data.menu_list[this.data.currentTab].mzid;
    console.log(mzid);
    var Liaofalist = await request({
      url: "GetLiaofaListBymzid",
      data: { mzid },
    });
    wx.setStorageSync("Treat_Theory2", { data: Liaofalist.data.data });
    console.log(Liaofalist.data.data);
    this.setData({
      Treat_Theory2: Liaofalist.data.data,
    });
  },
});
