Page({
    data: {

    },
    onShow() {

    },
    goToFront_page: function(e){
        wx.switchTab({
        url: '/pages/front_page/index',
      });
        
    }

  })