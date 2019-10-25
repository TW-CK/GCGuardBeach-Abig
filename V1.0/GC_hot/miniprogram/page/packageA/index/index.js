const {
  $Message
} = require('../../../dist/base/index');
const QQMapWX = require('../../../utils/qqmap-wx-jssdk');
const requests = require('../../../utils/requests')
const weatherLogoList = require('../../../utils/weatherLogo')
const utils = require('../../../utils/util')
var qqmapsdk;
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    start: "茂名-中国第一滩",
    max: 100,
    value: "",
    files: [],
    longitude: 113.324520,
    latitude: 23.099994,
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    Popping: false, //是否已经弹出
    animPlus: {}, //旋转动画
    animCollect: {}, //item位移,透明度
    animTranspond: {}, //item位移,透明度
    animChat: {},
    weatherResult: '',
    spinShow: false,
    weatherColorList: ['green', 'yellow', 'red'],
    weatherColor: 'green',
    weatherLevel: ['优', '良', '差'],
    weatherLogoList: weatherLogoList.weatherLogo,
    weatherLogo: '../../../images/weatherLogo/999.png',
    thisWeekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    thisWeekListTime: utils.thisWeek(),
    thisWeek: '星期一',
    newTime: ''
  },
  /**
   * 点击弹出
   */
  plus: function() {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  /**
   * 首页进入志愿者
   */
  transpond: function() {
    wx.navigateTo({
   
    })
  },
  /**
   *首页进入发现
   */
  find: function() {
    wx.navigateTo({
      url: '../../packageF/pages/find/find',
    })
  },
  // 进入志愿者
  volut: function() {
    wx.navigateTo({
      url: '../../packageB/pages/volunteer/volunteer',
    })
  },
  // 进入冷知识
  know: function () {
    wx.navigateTo({
      url: '../../packageB/pages/knowledge/knowledge',
    })
  },
  /**
   * 弹出动画
   */
  popp: function() {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationChat = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(10, 80).rotateZ(0).opacity(1).step();
    animationTranspond.translate(-20, 120).rotateZ(0).opacity(1).step();
    animationChat.translate(10, 160).rotateZ(0).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animChat: animationChat.export(),
    })
  },
  /**
   * 收回动画
   */
  takeback: function() {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationChat = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(10, 120).rotateZ(0).opacity(0).step();
    animationTranspond.translate(10, 120).rotateZ(0).opacity(0).step();
    animationChat.translate(10, 120).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animChat: animationChat.export(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var _this = this;
    _this.setData({
      spinShow: true
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // 根据经纬度获取天气
        _this.weatherAll(latitude, longitude)
      },
      fail(err) {
        // 拒绝定位，默认北京
        _this.weatherAll()
        $Message({
          content: '位置定位失败,默认北京气候',
          type: 'warning'
        });
      }
    })
    /**
     * 查看是否授权
     */
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              // 用户已经授权过,不改变 isHide 的值
              // 用户授权成功后，调用微信的 wx.login 接口，从而获取code
              // wx.login({
              //   success: res => {
              // 获取到用户的 code 之后：res.code
              // console.log("用户的code:" + res.code);
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              // console.log("用户名为:" + nickName);
              wx.setStorageSync('name', nickName);
              wx.setStorageSync('avatar', avatarUrl);
              // }
              // });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          _this.setData({
            isHide: true
          });
          wx.hideTabBar({});
        }
      }
    });
  },
  login: function() {
    wx.redirectTo({
      url: '../login/login',
    })
  },
  /**
   * 根据经纬度返回地区
   * @param {latitude} 经度
   * @param {longitude} 纬度
   */
  weatherAll: function(latitude = '', longitude = '') {
    let _this = this
    if (latitude && longitude) {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
      });
      qqmapsdk.reverseGeocoder({
        //位置坐标，默认获取当前位置，非必须参数 
        //Object格式
        location: {
          latitude: latitude,
          longitude: longitude
        },
        sig: '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ',

        success: function(res) { //成功后的回调
          // 渲染天气
          let start = [res.result.address_component.city, '-', res.result.address_component.district, '-', res.result.address_component.street_number].join("")
          let city = res.result.address_component
          _this.weatherApply(start, city)
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        }
      })
    } else {
      _this.weatherApply()
    }
  },
  /**
   * 根据地区返回天气
   * @param {start} 显示出来的位置
   * @param {city.district} 小地点
   * @param {city.city} 大地点
   */
  weatherApply: function(start = '北京', city = {
    district: "北京",
    city: "北京"
  }) {
    let _this = this
    _this.setData({
      start: start
    })
    // 传入位置，返回天气
    let item = {
      url: 'https://www.toutiao.com/stream/widget/local_weather/data/',
      data: {
        city: city.district
      },
      method: 'GET',
      header: {}
    }
    // 天气
    let num = 0 // 只作一次更改
    let event = async(itemTemp) => {
      let result = await requests.requestUtils(itemTemp)
      // 如果区域没有搜索到，则进行市区查询
      if (result.data.city != city.city && num <= 0) {
        num++ // 防止两次打印
        item.data.city = city.city
        return event(item)
      }

      // 空气质量颜色问题
      _this.weatherColorFun(result.data.weather.quality_level)

      // 根据气候选Logo
      _this.weatherLogoFun(result.data.weather.dat_condition)

      // 星期数
      _this.weatherWeek()

      _this.setData({
        weatherResult: result.data.weather,
        spinShow: false
      })
      console.log(result.data.weather)
    }
    event(item)
  },
  /**
   * 空气质量颜色问题
   * @param {quality_level} 空气质量
   */
  weatherColorFun: function(quality_level) {
    let _this = this
    let numTempLevel = _this.data.weatherLevel.indexOf(quality_level)

    if (numTempLevel != -1) {
      _this.setData({
        weatherColor: _this.data.weatherColorList[numTempLevel]
      })
    }

  },
  /**
   * 空气LOGO问题
   * @param {dat_condition} 气候
   */
  weatherLogoFun: function(dat_condition) {
    let _this = this
    console.log(dat_condition)
    let dat_condition_list = []
    for (let i = 0; i < _this.data.weatherLogoList.length; i++) {
      dat_condition_list.push(_this.data.weatherLogoList[i].name)
    }
    let numTemp = dat_condition_list.indexOf(dat_condition)
    if (numTemp == -1) {
      let numTemp2 = dat_condition_list.indexOf(dat_condition.split('转')[0])
      if (numTemp2 != -1) {
        _this.setData({
          weatherLogo: _this.data.weatherLogoList[numTemp2].url
        })
      }
    } else {
      _this.setData({
        weatherLogo: _this.data.weatherLogoList[numTemp].url
      })
    }
  },
  /**
   * 星期数
   */
  weatherWeek: function() {
    let _this = this
    let numTemp = _this.data.thisWeekListTime.indexOf(utils.formatTime(new Date).split(" ")[0].replace('/', '-').replace('/', '-'))
    _this.setData({
      newTime: utils.formatTime(new Date).split(" ")[0].replace('/', '年').replace('/', '月'),
      thisWeek: _this.data.thisWeekList[numTemp]
    })
  }
})
