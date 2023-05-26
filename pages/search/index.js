// 1.输入框绑定数据，input值改变input事件：
// 		1..获取输入框值
// 		2.合法性判断
// 		3.检验通过 输入框值发送到数据库查询
// 		4.返回数据到页面
// 2.防抖——>定时器id  （输入框中）节流：一般用在页面下拉上t
import { request } from "../../request/index.js";
Page({
  data: {
    a: [], //这是一个空的数组，等下获取到云数据库的数据将存放在其中
    value: "",
    //取消按钮是否显示
    isFocus: false,
  },
  TimeId: -1,
  //输入框值改变触发
  put(e) {
    var that = this;
    //1.获取输入框值
    var value = e.detail.value;
    that.setData({
      value,
      isFocus: true,
    });
    console.log(value);
    console.log(that.data.a);
    if (!value.trim()) {
      that.setData({
        a: [1, 2, 3],
        isFocus: false,
      });
      //输入值不合法
      return;
    }
    clearTimeout(that.TimeId);
    that.TimeId = setTimeout(() => {
      //防抖
      try {
        that.getSeachList(value);
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  },
  async getSeachList(keyword) {
    var res = await request({
      url: "GoodsList1",
      data: { keyword },
    });
    console.log(res);
    this.setData({
      a: res.data.data,
    });
  },
  gotoDetail: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods_detail/index?goods_id=" + goods_id,
    });
  },
  //点击取消
  handleCancel(e) {
    console.log(this.data.a);
    this.setData({
      value: "",
      isFocus: false,
      a: [],
    });
  },
});
