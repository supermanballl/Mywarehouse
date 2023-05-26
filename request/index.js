// 定义公共的url
const baseUrl = "http://47.92.30.79:82/home/";
export const request = (param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...param,
      url: baseUrl + param.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
// 定义公共的url
export const request1 = (param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...param,
      url: param.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
//param表示你要传递的参数对象，如url、data、header等等，具体参考文档wx.request（）里面有哪些属性。
