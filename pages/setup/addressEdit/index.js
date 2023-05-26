
Page({
  data: {
    
  
  },
  onLoad(){

    
  },
  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { addressid } = options;
    console.log(addressid);
    if(addressid==undefined){//添加

    }
    else{//编辑
      //数据库获取该地址数据

    }
    
  },
})