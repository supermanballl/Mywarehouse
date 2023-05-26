
const videoList = []
Page({
  data: {
    videoList,
    activeId:2,
    isPlaying:true
  },
  onLoad() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systemInfo:res,
          menuButtonBoundingClientRect: wx.getMenuButtonBoundingClientRect(),
        })
        console.log(res)
      },
    })
    this.setData({
      videoList: [{
        id: 1,
        title: "黄渤",
        desc: "中国女排发布会，黄渤与巩俐中国女排发布会，黄渤与巩俐",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851354869410.mp4?sign=1f636557effa496e074332e3f4b9b8aa&t=1589851461"
      }, {
        id: 2,
        title: "莱万多夫斯基",
        desc: "莱万多夫斯基逆天五子登科",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851322674828.mp4?sign=185e46cba885c4303c7cf5f8658bea9b&t=1589851482"
      }, {
        id: 3,
        title: "驾考那些事",
        desc: "半坡起步是多难",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851312271309.mp4?sign=978660c42305ec67d4c3d603c2ae5a3d&t=1589851496"
      }, {
        id: 4,
        title: "小美女",
        desc: "蹦蹦跳跳",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851307588534.mp4?sign=43cf344e83089348eeeea38d26ba51bb&t=1589851514"
      }, {
        id: 5,
        title: "黄渤",
        desc: "中国女排发布会，黄渤与巩俐中国女排发布会，黄渤与巩俐",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851354869410.mp4?sign=1f636557effa496e074332e3f4b9b8aa&t=1589851461"
      }, {
        id: 6,
        title: "莱万多夫斯基",
        desc: "莱万多夫斯基逆天五子登科",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851322674828.mp4?sign=185e46cba885c4303c7cf5f8658bea9b&t=1589851482"
      }, {
        id: 7,
        title: "驾考那些事",
        desc: "半坡起步是多难",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851312271309.mp4?sign=978660c42305ec67d4c3d603c2ae5a3d&t=1589851496"
      }, {
        id: 8,
        title: "小美女",
        desc: "蹦蹦跳跳",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851307588534.mp4?sign=43cf344e83089348eeeea38d26ba51bb&t=1589851514"
      }, {
        id: 9,
        title: "黄渤",
        desc: "中国女排发布会，黄渤与巩俐中国女排发布会，黄渤与巩俐",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851354869410.mp4?sign=1f636557effa496e074332e3f4b9b8aa&t=1589851461"
      }, {
        id: 10,
        title: "莱万多夫斯基",
        desc: "莱万多夫斯基逆天五子登科",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851322674828.mp4?sign=185e46cba885c4303c7cf5f8658bea9b&t=1589851482"
      }, {
        id: 11,
        title: "驾考那些事",
        desc: "半坡起步是多难",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851312271309.mp4?sign=978660c42305ec67d4c3d603c2ae5a3d&t=1589851496"
      }, {
        id: 12,
        title: "小美女",
        desc: "蹦蹦跳跳",
        url: "https://6e6f-normal-env-ta6pc-1300924598.tcb.qcloud.la/video-swiper/1589851307588534.mp4?sign=43cf344e83089348eeeea38d26ba51bb&t=1589851514"
      }]
    })
  },
  onPlay(e) {
    // console.log("开始播放",e)
  },
  onShowPause(e){
    this.setData({
      isPlaying: false
    })
  },
  onHidePause(e){
    this.setData({
      isPlaying: true
    })
  },
  onPause(e) {
  },

  onEnded(e) {
    // console.log(e)
  },

  onError(e) {
  },

  onWaiting(e) {
  },

  onTimeUpdate(e) {
  },

  onProgress(e) {
  },
  onChange(e) {
    console.log(e)
    console.log("id",e.detail.activeId)
    this.setData({
      activeId:e.detail.activeId
    })
  },
  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  },
  go2Home() {
    wx.navigateBack({
      delta: 1,
    })
  },
})
