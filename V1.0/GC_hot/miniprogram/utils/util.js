function Utils() { }

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
  * 格式化时间
  * @param {date} 当前时间戳
  * @return 返回的是已格式化的时间
  */
Utils.prototype.formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


/**
  * 生成十个不重复的随机数
  * @return 返回的是十个随机数字符串
  */
Utils.prototype.randomNum = () => {
  var arr1 = new Array();
  var arr2 = new Array();
  for (var i = 0; i < 20; i++) {

    arr1.push(i);

  }

  for (var k = 0; k < 10; k++) {

    var id = Math.ceil(Math.random() * 19);
    if (arr2.indexOf(arr1[id]) === -1) {
      arr2.push(arr1[id]);
    } else {
      k = k - 1;
      continue;
    }
  }
  return arr2.join("")
}

/**
 * 生成随机数
 * @param {*} minNum 最小值
 * @param {*} maxNum 最大值
 */
Utils.prototype.randomNumOneToOne = (minNum, maxNum) => {
  let Range = maxNum - minNum;
  let Rand = Math.random();
  return (minNum + Math.round(Rand * Range));
}

/**
  * 返回当周的时间
  * @return 周数
  * @example 当天：2019-10-05  return ["2019-09-30", "2019-10-01", "2019-10-02", "2019-10-03", "2019-10-04", "2019-10-05", "2019-10-06"]
  */
Utils.prototype.thisWeek = () => {
  const dateOfToday = Date.now()
  const dayOfToday = (new Date().getDay() + 7 - 1) % 7
  const daysOfThisWeek = Array.from(new Array(7))
    .map((_, i) => {
      const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
      return date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0')
    })
  return daysOfThisWeek
}

/**
 * 距离转换
 * @param {distance} 米
 * @return 公里
 */
Utils.prototype.distanceFormat = (distance) => {
  return Math.round((distance / 100) / 10).toFixed(1)
}

/**
 * 聚类
 * @param {*} array 需要聚类的数组
 */
Utils.prototype.aggregationFunc = (array) => {
  let valueTemp = [{}]
  let oneType = []
  let i = 0;
  array.map((value, index) => {
    if (oneType.indexOf(value.oneType) == -1) {
      i = oneType.push(value.oneType)
      valueTemp[i - 1] = {}
      valueTemp[i - 1].select = new Array();
      valueTemp[i - 1].title = value.oneType
    }
    valueTemp[oneType.indexOf(value.oneType)].select.push({
      image: value.image,
      type: value.twoType
    })
  })
  return valueTemp
}

module.exports = Utils
