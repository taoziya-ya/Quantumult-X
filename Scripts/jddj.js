const cookieName ='京东到家'
const signurlKey = 'chen_signurl_qmkg'
const signheaderKey = 'chen_signheader_qmkg'
const chen = init()
const signurlVal = chen.getdata(signurlKey)
const signheaderVal = chen.getdata(signheaderKey)
sign()
function sign() {
    let url = {url: signurlVal,headers: JSON.parse(signheaderVal)}
    chen.get(url, (error, response, data) => {
      chen.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      let subTitle = ``
      let detail = ``
      if (result.code == 0) {
        subTitle = `签到结果:   成功`
        detail = `获取鲜豆：${result.result.points}`
      } else if(result.code==201){
        subTitle = `签到结果: 失败`
        detail = `说明: 未知`
      } else {
        subTitle = `签到结果: 重复签到`
        detail = `说明: ${result.msg}`
      }
      chen.msg(title, subTitle, detail)
      chen.log(`${result.totalBalanceAmount}`)
    })
    chen.done()
    }

  function init() {
    isSurge = () => {
      return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
      return undefined === this.$task ? false : true
    }
    getdata = (key) => {
      if (isSurge()) return $persistentStore.read(key)
      if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
      if (isSurge()) return $persistentStore.write(key, val)
      if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
      if (isSurge()) $notification.post(title, subtitle, body)
      if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
      if (isSurge()) {
        $httpClient.get(url, cb)
      }
      if (isQuanX()) {
        url.method = 'GET'
        $task.fetch(url).then((resp) => cb(null, {}, resp.body))
      }
    }
    post = (url, cb) => {
      if (isSurge()) {
        $httpClient.post(url, cb)
      }
      if (isQuanX()) {
        url.method = 'POST'
        $task.fetch(url).then((resp) => cb(null, {}, resp.body))
      }
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
  }