const key = "ZHIBZ-V3DCF-BBAJS-J4LHB-5JXVE-KMBDN"; // 使用在腾讯位置服务申请的key
const referer = "果帕雅"; // 调用插件的app的名称
//const hotCitys = '北京,上海,天津,重庆,广州,深圳,成都,杭州'; // 用户自定义的的热门城市
const citySelector = requirePlugin("citySelector");
Page({
  data: {
    key: "ZHIBZ-V3DCF-BBAJS-J4LHB-5JXVE-KMBDN", // 使用在腾讯位置服务申请的key
    referer: "果帕雅", // 调用插件的app的名称
    address: {
      province: "",
      city: "",
      district: "",
    }, //城市选择器得出的省市区
    addressid: "",
    addAddress: {
      id: "",
      openid: "",
      province: "",
      city: "",
      district: "",
      name: "",
      phone: "",
      remark: "",
    },
    getname: "",
    getphone: "",
    getarea: "",
    getremark: "",
    hidden: "true",
    isDefault: false,
    switch1Checked: false,
  },

  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { addressid } = options;
    this.setData({
      addressid,
    });
    console.log(options);
    if (addressid != undefined && this.data.address.province == "") {
      //判断为增加还是修改,,,,数据回显
      var reqTask = wx.request({
        url: "http://47.92.30.79:82/home/SingleAddress",
        data: {
          addressid: addressid,
        },
        header: { "content-type": "application/json" },
        method: "GET",
        dataType: "json",
        responseType: "text",
        success: (result) => {
          console.log(result);
          var switch1Checked = false;
          if (result.data.Data[0].isDefault === 1) {
            switch1Checked = true;
          }
          this.setData({
            addAddress: result.data.Data[0],
            getname: result.data.Data[0].name,
            getphone: result.data.Data[0].phone,
            getarea:
              result.data.Data[0].province +
              result.data.Data[0].city +
              result.data.Data[0].district,
            getremark: result.data.Data[0].remark,
            isDefault: result.data.Data[0].isDefault,
            switch1Checked,
            hidden: false,
          });
        },
        fail: (e) => {
          console.log(e);
        },
      });
    }
    if (addressid == undefined) {
      //增加
      this.setData({
        hidden: true,
      });
    }
    var addAddress = this.data.addAddress;
    if (address != "") {
      var address = this.data.address;
      addAddress.province = address.province;
      addAddress.city = address.city;
      addAddress.district = address.district;
    }
    this.setData({
      addAddress,
    });
    console.log(this.data.address);
    var address = this.data.address;
    var getarea = address.province + address.city + address.district;
    this.setData({
      getarea,
    });
    console.log(this.data.getarea);
  },
  onUnload() {
    // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
    //citySelector.clearCity();
  },
  switch1Change: function (e) {
    console.log(`Switch样式点击后是否选中：`, e.detail.value);
    this.setData({
      isDefault: e.detail.value,
    });
  },

  saveAddress: function (e) {
    const openid = wx.getStorageSync("openid") || [];
    var addAddress = this.data.addAddress;
    var flag = 0;
    if (this.data.isDefault) {
      flag = 1;
    }
    //数据库保存数据
    //更新
    if (this.data.addressid != undefined) {
      console.log(addAddress);
      var reqTask = wx.request({
        url: "http://47.92.30.79:82/home/UpdataAddress",
        data: {
          id: this.data.addressid,
          openid: openid.data,
          province: addAddress.province,
          city: addAddress.city,
          district: addAddress.district,
          name: addAddress.name,
          phone: addAddress.phone,
          remark: addAddress.remark,
          isDefault: flag,
        },
        header: { "content-type": "application/json" },
        method: "GET",
        dataType: "json",
        responseType: "text",
        success: (result) => {
          console.log(result);
          wx.navigateBack({
            delta: 1,
          });
          // wx.navigateBack({
          //   url: '../address/index',
          // });
        },
        fail: (e) => {
          console.log(e);
        },
      });
    } else {
      //添加
      var reqTask = wx.request({
        url: "http://47.92.30.79:82/home/AddAddress",
        data: {
          openid: openid.data,
          province: addAddress.province,
          city: addAddress.city,
          district: addAddress.district,
          name: addAddress.name,
          phone: addAddress.phone,
          remark: addAddress.remark,
          isDefault: flag,
        },
        header: { "content-type": "application/json" },
        method: "GET",
        dataType: "json",
        responseType: "text",
        success: (result) => {
          console.log(result);
        },
        fail: (e) => {
          console.log(e);
        },
        complete: () => {},
      });
      wx.navigateBack({
        delta: 1,
      });
    }
  },

  delAddress: function (e) {
    console.log(this.data.addressid);
    var that = this;
    wx.showModal({
      title: "删除",
      content: "确认删除该地址？",
      success(res) {
        if (res.confirm) {
          //确定绑定的操作
          var reqTask = wx.request({
            url: "http://47.92.30.79:82/home/DeleteAddress",
            data: {
              id: that.data.addressid,
            },
            header: { "content-type": "application/json" },
            method: "GET",
            dataType: "json",
            responseType: "text",
            success: (result) => {
              console.log(result);
              wx.navigateBack({
                delta: 1,
              });
              //   ({
              //   url: '../address/index',
              // });
            },
            fail: (e) => {
              console.log(e);
            },
          });
        } else if (res.cancel) {
          //取消绑定的操作
        }
      },
    });
  },
  ChooeseAddress: function (e) {
    console.log("54564646");
    //显示加载界面
    wx.showLoading({
      // 显示加载中loading效果
      title: "加载中",
      mask: true, //开启蒙版遮罩
    });
    wx.navigateTo({
      url: "/libs/citySelector/switchcity/switchcity",
    });
    //隐藏加载界面
    wx.hideLoading();
  },

  getInputName(e) {
    console.log(e.detail.value);
    var addAddress = this.data.addAddress;
    addAddress.name = e.detail.value;
    this.setData({
      addAddress,
    });
  },
  getInputPhone(e) {
    console.log(e.detail.value);
    var addAddress = this.data.addAddress;
    addAddress.phone = e.detail.value;
    this.setData({
      addAddress,
    });
  },
  getInputRemark(e) {
    console.log(e.detail.value);
    var addAddress = this.data.addAddress;
    addAddress.remark = e.detail.value;
    this.setData({
      addAddress,
    });
  },
});
