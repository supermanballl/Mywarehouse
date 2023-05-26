/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 
2 页面加载完毕
  0 onLoad  onShow 
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
3 onShow 
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1;
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  5 总数量 +=商品的数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量。。。
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
    1 “+” "+1"
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车的数量 =1 同时 用户 点击 "-"
    弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消  什么都不做 
  4 直接修改商品对象的数量 num
  5 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面！ 
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    openid: "",
    cart_id: "",
    goods_id: "",
    address: {},
    cart: [
      {
        goods_id: 1,
        pics: [
          {
            pics_id: 1,
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_id: 2,
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_id: 3,
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_id: 4,
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
        ],
        goods_price: "100",
        goods_name: "透视速诊",
        goods_introduce: [
          {
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
        ],
        //商品是否被收藏
        isCollect: false,
        //选中该商品
        checked: false,
        //加入购物车的商品数量
        num: 1,
      },
      {
        goods_id: 2,
        pics: [
          {
            pics_id: 1,
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_id: 2,
            pics_mid: "http://47.92.30.79/images/front_page/2.jpg",
          },
          {
            pics_id: 3,
            pics_mid: "http://47.92.30.79/images/front_page/3.jpg",
          },
          {
            pics_id: 4,
            pics_mid: "http://47.92.30.79/images/front_page/4.jpg",
          },
        ],
        goods_price: "200",
        goods_name: "透视速诊1",
        goods_introduce: [
          {
            pics_mid: "http://47.92.30.79/images/front_page/1.jpg",
          },
          {
            pics_mid: "http://47.92.30.79/images/front_page/2.jpg",
          },
          {
            pics_mid: "http://47.92.30.79/images/front_page/3.jpg",
          },
          {
            pics_mid: "http://47.92.30.79/images/front_page/4.jpg",
          },
        ],
        //商品是否被收藏
        isCollect: false,
        //选中该商品
        checked: false,
        //加入购物车的商品数量
        num: 1,
      },
    ],
    cartList: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    goods: [
      {
        goods_id: 1,
        goods_title: "透视速诊",
        goods_price: 68.0,
        goods_howBuy: "套",
        goods_yunfei: 0,
        goods_xiaoliang: 300,
        content:
          "商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情",
        src: "http://47.92.30.79/images/front_page/透目速诊.jpg",
      },
      {
        goods_id: 2,
        goods_title: "天然牛角刮痧板",
        goods_price: 39.9,
        goods_howBuy: "块",
        goods_yunfei: 0,
        goods_xiaoliang: 100,
        src: "http://47.92.30.79/images/front_page/天然牛角刮痧板.jpg",
      },
      {
        goods_id: 3,
        goods_title: "家用火罐套装",
        goods_price: 19.9,
        goods_howBuy: "套",
        goods_yunfei: 0,
        goods_xiaoliang: 200,
        src: "http://47.92.30.79/images/front_page/火罐.jpg",
      },
    ],
    goods1: [],
    payList: [],
  },
  onShow() {
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
    ///
    let openid = wx.getStorageSync("openid") || [];
    this.setData({
      openid,
    });
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取购物车数据
    this.getCartList(openid.data);
    console.log(this.data.cart);
  },
  async getCartList(openid) {
    var cartList = await request({
      url: "SelectCartList",
      data: { openid },
    });
    console.log(cartList);
    var cart = [];
    for (var i = 0; i < cartList.data.Data.length; i++) {
      var goods_id = cartList.data.Data[i].goods_id;
      var result = await request({
        url: "GoodsListById",
        data: { goods_id },
      });
      console.log(result.data.data[0]);
      cart[i] = result.data.data[0];
      cart[i].cartid = cartList.data.Data[i].cart_id;
      cart[i].num = cartList.data.Data[i].cart_num;
      cart[i].checked = false;
    }
    console.log(cart);
    this.setData({
      cart,
    });
  },

  // 商品的选中
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex((v) => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    var payList = [];
    var i = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
        payList[i] = v;
        i++;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    totalPrice = Number(totalPrice.toString().match(/^\d+(?:\.\d{0,2})?/));
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
      payList,
    });
    wx.setStorageSync("cart", cart);
  },
  // 商品全选功能
  handleItemAllCheck() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach((v) => (v.checked = allChecked));
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    var { operation, id, cartid } = e.currentTarget.dataset;
    var goods_id = id;
    var cart_id = cartid;
    this.setData({
      goods_id: id,
      cart_id: cartid,
    });
    var goods_id = this.data.goods_id;
    var cart_id = this.data.cart_id;
    console.log(cart_id);
    var openid = this.data.openid.data;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex((v) => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
        //删除

        await request({
          url: "DeleteCart",
          data: { cart_id },
        });
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
      //更新购物车数据库
      var cart_num = cart[index].num;
      await request({
        url: "UpdataCart",
        data: { cart_id, goods_id, openid, cart_num },
      });
    }
  },
  // 点击 结算
  async handlePay() {
    // 1 判断用户有没有选购商品
    if (this.data.totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    //2 需要结算的goods_id存入数组
    var payList = this.data.payList;
    var goods_idList = [];
    for (var i = 0; i < payList.length; i++) {
      goods_idList[i] = payList[i].goods_id;
    }
    console.log(payList);
    //3 跳转到 支付页面
    wx.navigateTo({
      url: "/pages/payDetail/index?goods_idList=" + goods_idList,
    });
  },
  getusermsg: function (e) {
    //获取用户唯一标识
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        console.log(code);
        var appId = "wx61d198560ad9261b"; //微信小程序AppID
        var secret = "12885148803dd711a22ce26257fd8f1e"; //可在微信公众平台设置扫描二维码获取
        wx.request({
          url:
            "https://api.weixin.qq.com/sns/jscode2session?appid=" +
            appId +
            "&secret=" +
            secret +
            "&js_code=" +
            code +
            "&grant_type=authorization_code",
          data: {},
          header: {
            "content-type": "json",
          },
          success: function (res) {
            var openid = res.data.openid; //返回openid
            console.log(openid); //控制台打印openid
            //app.globalData.userOpenId = openid;
          },
        });
      },
    });
  },
  frontToCart: function (e) {
    console.log(e.currentTarget.dataset.id);
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods_detail/index?goods_id=" + goods_id,
    });
  },
});
