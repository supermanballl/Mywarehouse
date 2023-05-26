Page({

  data: {
    time:'',
    id:0,
    yangsheng:[],
  },

  onShow() {
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
    var reqTask = wx.request({//数据库请求养生表数据
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
          yangsheng:result.data.Data
        })
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
})