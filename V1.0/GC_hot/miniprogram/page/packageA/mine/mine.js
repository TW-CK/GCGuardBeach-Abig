Page({
  data: {
    username: '',
    useravatar: '',
    current: 'mine',
    cardList: [{
      id: 1,
      title: "用户信息",
      type: "addressbook",
      url: "../../packageH/pages/myinfo/myinfo"

    },
    {
      id: 2,
      title: "我的社区记录",
      type: "document",
      url: "../../packageF/pages/record/record"
    },
    {
      id: 3,
      title: "我的组织",
      type: "interactive",
      url: "../../packageH/pages/myVolunteer/myVolunteer"
    },
    {
      id: 4,
      title: "意见反馈",
      type: "feedback",
      url: "../../packageH/pages/feedback/feedback"
    },
    {
      id: 5,
      title: "关于我们",
      type: "more",
      url: "../../packageH/pages/about/about"
    }
    ]
  },
  onLoad: function () {
    var name = wx.getStorageSync('name')
    this.setData({
      username: name
    });
    var avatar = wx.getStorageSync('avatar')
    this.setData({
      useravatar: avatar
    });
  },
  rank: function () {
  wx.navigateTo({
    url: '../../packageH/pages/rank/rank',
  })
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  gocar:function(){
  wx.navigateTo({
    url: '../../packageG/pages/commoditycar/commoditycar',

  })
  },
  goorder: function () {
    wx.navigateTo({
      url: '../../packageG/pages/order/order',

    })
  }
});