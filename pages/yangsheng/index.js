Page({
  data: {
      open: false,
      // mark 是指原点x轴坐标
      mark: 0,
      // newmark 是指移动的最新点的x轴坐标 
      newmark: 0,
      istoright: true,
      Allyangsheng:[],//12时辰养生数据
      yangsheng:[],//当前页面时辰养生数据
      id:0,//时辰id
      timeRange:""//当前时刻的范围
  },
  menuSelectYangsheng:function(e){
    console.log(e.currentTarget.dataset.id);
    //如果id==当前时辰的id则不变
    if(e.currentTarget.dataset.id==this.data.id){
      this.openSlider();
    }
    else{
      var reqTask = wx.request({//数据库请求养生表数据
        url: 'http://47.92.30.79:82/home/GetYangShengList',
        data: {
          id:e.currentTarget.dataset.id
        },
        header: {'content-type':'application/json'},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          console.log(result.data.Data);
          this.setData({
            yangsheng:result.data.Data
          })
        },
        fail: () => {},
        complete: () => {}
      });
      this.openSlider();
    }
  },
  onShow(){
    // 十二时辰按照地支，十二属相排列
    let tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    // 十二时辰对应
    let sdArr = ['夜半', '鸡鸣', '平旦', '日出', '食时', '隅中', '日平', '日昳', '晡时', '日入', '黄昏', '人定']
    // 一个时辰为八刻
    let skArr = ['一', '二', '三', '四', '五', '六', '七', '八']
    // 默认获取当前时辰，时刻
    const getShiChen = (h = new Date().getHours(), m = new Date().getMinutes(), s = new Date().getSeconds()) => {
      let shichenStr = tzArr[parseInt(h / 2)] + '时（' + sdArr[parseInt(h / 2)] + '）';
      this.setData({
        id:parseInt(h / 2)+1
      });
      // 判断时刻
      if (h % 2 === 0) {
        shichenStr += skArr[parseInt(m / 15)]
      } else if (h % 2 === 1) {
        shichenStr += skArr[parseInt(m / 15) + 4]
      }
      return shichenStr + '刻'
    }
    console.log(getShiChen());
    this.setData({
      time:getShiChen(),
    })
    setTimeout(function(){
      getShiChen();
    },1000);//一秒刷新一次
    var reqTask = wx.request({//数据库请求12时辰养生表数据
      url: 'http://47.92.30.79:82/home/GetAllYangShengList',
      data: {
        id:this.data.id
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data.Data);
        this.setData({
          Allyangsheng:result.data.Data
        })
      },
      fail: () => {},
      complete: () => {}
    });
    var reqTask1 = wx.request({//数据库请求养生表数据
      url: 'http://47.92.30.79:82/home/GetYangShengList',
      data: {
        id:this.data.id
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data.Data);
        this.setData({
          yangsheng:result.data.Data,
          timeRange:result.data.Data[0].timeRange
        })
      },
      fail: () => {},
      complete: () => {}
    });
  },
  // 点击左上角小图标事件
  openSlider: function (e) {
    if (this.data.open) {
      this.setData({
        open: false,
      });
    } else {
      this.setData({
        open: true,
      });
    }
  },
  tap_ch: function(e) {
      if (this.data.open) {
          this.setData({
              open: false,
          });
      } else {
          this.setData({
              open: true,
          });
      }
  },

  tap_start: function(e) {
      // touchstart事件
      // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
      this.data.mark = this.data.newmark = e.touches[0].pageX;
  },

  tap_drag: function(e) {
      // touchmove事件
      this.data.newmark = e.touches[0].pageX;
     
      // 手指从左向右移动
      if (this.data.mark < this.data.newmark) {
          this.istoright = true;
      }
      
      // 手指从右向左移动
      if (this.data.mark > this.data.newmark) {
          this.istoright = false;
      }
      this.data.mark = this.data.newmark;
  },

  tap_end: function(e) {
      // touchend事件
      this.data.mark = 0;
      this.data.newmark = 0;
      // 通过改变 opne 的值，让主页加上滑动的样式
      if (this.istoright) {
          this.setData({
              open: true,
          });
      } else {
          this.setData({
              open: false,
          });
      }
  }
})