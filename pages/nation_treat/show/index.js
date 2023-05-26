Page({
  data: {
    treat: {
      title: "四塔（塔都档细）理论",
      img: "http://47.92.30.79/images/front_page/天然牛角刮痧板.jpg",
      title_txt:
        "四塔是“塔都档细”的简称。“塔”是音译，有界别、类种、元素、要素之意。包括“瓦约塔都”，简称塔拢（风塔）、“爹卓塔都”，简称塔非（火塔）、“阿波塔都”，简称塔喃（水塔）和“巴他维塔都”，简称塔拎（土塔）。四塔是构成世果万物和人体最基本的物质元素，世界上一切事物，都是由风、火、水、土四种基本物质之间运动变化生成的。人体之四塔先天禀受干父母，受后天水谷的补充和滋养，维持着人的生理功能。四塔既是生命活动不可缺少的物质元素，也是机体组织器官内脏生成的本源。万物有形，人身有形，形不离四塔。四搭是人体物质基础，并主管机体的各种生理功能活动。人体没有四塔就没有生命，四塔随生命的发生而存在，随其终结而消亡，傣医将其慨述为“四大元素”。",
      h1: [
        {
          txt_h2: "塔拢（风、气）",
          txt_img: "http://47.92.30.79/images/front_page/天然牛角刮痧板.jpg",
          txt: "人体基本的物质元素之一，其以动为性，有支持、资助和运动的特性，具有生长一切的作用。因此，凡具有“动”而不定或有支持性、吹动的功能特征者皆属塔拢（风、气）所管；在生理上塔拢（风、气）包括两个方面，一是指人体生命活动外在的表现；二是泛指五脏六腑及组织器官的生理功能活动。傣医认为塔拢（风、气）由六大类风气组成，主要分为上行风、下行风、腹内风、腹外风、肢体风、呼吸风。",
        },
        {
          txt_h2: "塔菲（火）",
          txt_img: "http://47.92.30.79/images/front_page/天然牛角刮痧板.jpg",
          txt: "傣医学认为，塔非（火）是人休生命的根本和维持生命活动的物质要素和动力，是机体生长发育的本源之一。其以热为性，有温煦似火的特性；具有成熟一切的作用。因此，凡具有“热”的性质，能温煦机体之功能者皆属塔非（火）主管。塔菲（火）先天受于父母，受后天之水谷化生所补充。 由四把火组成，即“几拿给（生命之火）”、“巴几给（生长发育之火）”“几拿腊给（体温之火）”和“温哈给（受纳消化之火）”，亦称“四种体属”。",
        },
        {
          txt_h2: "塔喃（水、血）",
          txt_img: "http://47.92.30.79/images/front_page/天然牛角刮痧板.jpg",
          txt: "傣医学认为，“没有水就没有生命”，塔哺（水、血）是人生命活动过程中重要物质本源其“以湿为性，能溶万物”，具有维持、黏结、收敛、聚合之特牲；具有摄集一切的作用。因此，凡具有“湿”性特征和流动状态，在人体内起滋润补益，滋养躯体作用者皆属塔喃（水、血）主管。水为有形之物，是一种流休组织，遍布全身各处、代表着机体内的物质储藏，是人体生命活动不可缺少的物质本源。",
        },
        {
          txt_h2: "塔拎（土）",
          txt_img: "",
          txt: "是构成人体的第一物质本源，是生命和生长发育不断延续的基础，塔拎（土）属物性，有形，有坚硬、固体的特性，具有保持一切的作用。因此，凡具有消化饮食物，化生气血，滋养躯体，排泄糟柏功能者皆为塔拎（士）所主管。",
        },
      ],
    },
    list: {
      txt: "",
      img: "",
      richtext: "",
    },
  },

  onShow: function () {
    wx.request({
      url: '"http://tts.youdao.com/fanyivoice?word=你好，我是你好&le=zh&keyfrom=speaker-target"',
      data: {},
      header: { "content-type": "application/json" },
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result);
      },
      fail: () => {},
      complete: () => {},
    });
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    console.log(currentPage);
    const { llid } = options;
    const { zfid } = options;
    const { lfid } = options;

    console.log(llid); //该id判断点击的是理论学说还是诊法疗法，以对应的表去查询数据

    //根据点击的理论学说，诊法，疗法treat_id和对应的llid查询数据库
    if (llid != undefined) {
      //查询理论学说数据库
      const Treat_Theory = wx.getStorageSync("Treat_Theory").data;
      console.log(Treat_Theory);
      let index = Treat_Theory.findIndex((v) => v.ll_id == llid);
      var treat = Treat_Theory[index];
      var list = this.data.list;
      console.log(treat);
      list.txt = treat.ll_txt;
      list.img = treat.ll_imgurl;
      list.richtext = treat.richtext;
      this.setData({
        treat,
        list,
      });
      console.log(list);
    } else if (zfid != undefined) {
      //查询诊法数据库
      const Treat_Theory1 = wx.getStorageSync("Treat_Theory1").data;
      let index = Treat_Theory1.findIndex((v) => v.zf_id == zfid);
      var treat = Treat_Theory1[index];
      var list = this.data.list;
      list.txt = treat.zf_txt;
      list.img = treat.zf_imgurl;
      list.richtext = treat.richtext;
      console.log(list);
      this.setData({
        treat,
        list,
      });
    } else if (lfid != undefined) {
      //查询疗法数据库
      const Treat_Theory2 = wx.getStorageSync("Treat_Theory2").data;
      let index = Treat_Theory2.findIndex((v) => v.lf_id == lfid);
      var treat = Treat_Theory2[index];
      var list = this.data.list;
      list.txt = treat.lf_txt;
      list.img = treat.lf_imgurl;
      list.richtext = treat.richtext;
      this.setData({
        treat,
        list,
      });
    } else {
      console("id标识错误");
    }
  },
  goToLast: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
});
