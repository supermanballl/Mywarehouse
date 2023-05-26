 Page({
    data: {
      tabs: [
        {
          id: 0,
          value: "体验问题",
          isActive: true
        },
        {
          id: 1,
          value: "商品、商家投诉",
          isActive: false
        }
      ],
      // 被选中的图片路径 数组
      chooseImgs: [],
      // 文本域的内容
      textVal: "",
      //反馈类型(默认为体验问题)
      textType:"体验问题",
      //反馈主题
      textTitle: [],
      //服务器返回的图片路径
      backImgPath:"",
      changecolor1:-1,
      backgroundcolor1:"",
      changecolor2:-1,
      backgroundcolor2:"",
      changecolor3:-1,
      backgroundcolor3:"",
      changecolor4:-1,
      backgroundcolor4:"",
  
    },
    // 外网的图片的路径数组
    UpLoadImgs: [],
    handleTabsItemChange(e) {
      // 1 获取被点击的标题索引
      const { index } = e.detail;
      if(index==0){
        this.setData({
          textType:"体验问题"
        })
      }
      else if(index==1){
        this.setData({
          textType:"商品、商家投诉"
        })
      }
      // 2 修改源数组
      let { tabs } = this.data;
      tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
      // 3 赋值到data中
      this.setData({
        tabs
      })
    },
    // 点击 “+” 选择图片
    handleChooseImg() {
      //2 调用小程序内置的选择图片api
      wx.chooseImage({
        // 同时选中的图片的数量
        count: 9,
        // 图片的格式  原图  压缩
        sizeType: ['original', 'compressed'],
        // 图片的来源  相册  照相机
        sourceType: ['album', 'camera'],
        success: (result) => {
          this.setData({
            // 图片数组 进行拼接 
            chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
          })
          console.log("chooseImgs");
          console.log(result);
        }
      });
      
  
    },
    // 点击 自定义图片组件
    handleRemoveImg(e) {
      // 2 获取被点击的组件的索引
      const { index } = e.currentTarget.dataset;
      // 3 获取data中的图片数组
      let { chooseImgs } = this.data;
      // 4 删除元素
      chooseImgs.splice(index, 1);
      this.setData({
        chooseImgs
      })
    },
    changebgc1:function(e){
      
      var changecolor1=this.data.changecolor1*=-1;
      console.log(e)
      this.setData({
        changecolor1,
        textTitle:this.data.textTitle+"功能建议"
      })
      if(changecolor1==1){
        this.setData({ 
          backgroundcolor1: "#00B271",
        })
      }
      else if(changecolor1==-1){
        this.setData({ 
          backgroundcolor1: "#fff"
        })
      }
      
    },
    changebgc2:function(e){
      
      var changecolor2=this.data.changecolor2*=-1;
      console.log(changecolor2)
      this.setData({
        changecolor2,
        textTitle:this.data.textTitle+"购买遇到问题"
      })
      if(changecolor2==1){
        this.setData({ 
          backgroundcolor2: "#00B271"
        })
      }
      else if(changecolor2==-1){
        this.setData({ 
          backgroundcolor2: "#fff"
        })
      }
      
    },
    changebgc3:function(e){
      
      var changecolor3=this.data.changecolor3*=-1;
      console.log(changecolor3)
      this.setData({
        changecolor3,
        textTitle:this.data.textTitle+"性能问题"
      })
      if(changecolor3==1){
        this.setData({ 
          backgroundcolor3: "#00B271"
        })
      }
      else if(changecolor3==-1){
        this.setData({ 
          backgroundcolor3: "#fff"
        })
      }
      
    },
    changebgc4:function(e){
      
      var changecolor4=this.data.changecolor4*=-1;
      console.log(changecolor4)
      this.setData({
        changecolor4,
        textTitle:this.data.textTitle+"其他"
      })
      if(changecolor4==1){
        this.setData({
          backgroundcolor4: "#00B271"
        })
      }
      else if(changecolor4==-1){
        this.setData({ 
          backgroundcolor4: "#fff"
        })
      }
      
    },
    // 文本域的输入的事件
    handleTextInput(e) {
      this.setData({
        textVal: e.detail.value
      })
    },
    // 提交按钮的点击
    handleFormSubmit() {
      // 1 获取文本域的内容 图片数组
      const { textVal, chooseImgs,textTitle,textType } = this.data;
      const openid=wx.getStorageSync("openid")||[];  
      var backImgPath=[];   
      var imgList_Tostring="";
      // 2 合法性的验证
      if (!textVal.trim()) {
        // 不合法
        wx.showToast({
          title: '输入不合法',
          icon: 'none',
          mask: true
        });
        return;
      }
      // 3 准备上传图片 到专门的图片服务器 
      // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
      // 显示正在等待的图片
      wx.showLoading({
        title: "正在上传中",
        mask: true
      });
      // 判断有没有需要上传的图片数组
      if (chooseImgs.length != 0) {
        chooseImgs.forEach((v, i) => {
          var j=i;
          wx.uploadFile({
            // api请求地址
            url: 'http://47.92.30.79:83/api/FileUpload/PictureUpload',
            // 被上传的文件的路径
            filePath: v,
            // 上传的文件的名称 后台来获取文件  file
            header: {
              'content-type': 'multipart/form-data'
              },
            name: 'upload',
            // 顺带的文本信息
            formData: {
              'textVal':textVal
            },
            success: (result) => {
              console.log(JSON.parse(result.data).picturePath);
              backImgPath[j]=JSON.parse(result.data).picturePath
              console.log(result.statusCode);
              if(result.statusCode==200){
                //图片已经存入服务器，将路径和文字存入数据库
                if(openid==[]){
                  wx.showToast({
                    title: '输入不合法',
                    icon: 'none',
                    mask: true
                  });
                }   
              }
              else{
                console.log("页面未找到或页面错误");
              }
              // 所有的图片都上传完毕了才触发  
              if (j === chooseImgs.length - 1) {
                for(var i=0;i<backImgPath.length;i++){
                  if(i==0){
                    imgList_Tostring=backImgPath[0];
                  }
                  imgList_Tostring=imgList_Tostring+","+backImgPath[i];
                }
                wx.hideLoading();
                console.log("把文本的内容和外网的图片数组 提交到后台中");
                var reqTask = wx.request({
                  url: 'http://47.92.30.79:82/home/SaveFankuiMSG',
                  data: {
                    openid:openid.data,//用户唯一标识
                    textType:textType,//反馈类型
                    textTitle:textTitle,//反馈主题
                    textVal:textVal,//反馈内容
                    chooseImgs:imgList_Tostring,//反馈图片数组
                  },
                  header: {'content-type':'application/json'},
                  method: 'GET',
                  dataType: 'json',
                  responseType: 'text',
                  success: (result) => {
                    console.log(result)
                  },
                  fail: (e) => {
                    console.log(e);
                  },
                });
                //提交成功重置页面
                this.setData({
                  textVal: "",
                  chooseImgs: []
                })
                // 返回上一个页面
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        })
      }else{
        wx.hideLoading();
        console.log("无图片，只提交文本");
        var reqTask = wx.request({
          url: 'http://47.92.30.79:82/home/SaveFankuiMSG',
          data: {
            openid:openid.data,//用户唯一标识
            textType:textType,//反馈类型
            textTitle:textTitle,//反馈主题
            textVal:textVal,//反馈内容
            chooseImgs:"",//反馈图片数组
          },
          header: {'content-type':'application/json'},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result) => {
            console.log(result)
          },
          fail: (e) => {
            console.log(e);
          },
        });
        wx.navigateBack({
          delta: 1
        }); 
      }
    }
  })