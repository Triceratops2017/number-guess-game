// index.js
Page({
  data: {
    low: 1,
    high: 100,
    guessNumber: 50,
    guessCount: 1,
    gameFinished: false,
    isListening: false,
    statusText: '点击麦克风开始游戏',
    micIcon: '🎤',
    micClass: '',
    shaking: false
  },

  onLoad() {
    this.initGame()
  },

  // 初始化游戏
  initGame() {
    this.setData({
      low: 1,
      high: 100,
      guessNumber: 50,
      guessCount: 1,
      gameFinished: false,
      isListening: false,
      statusText: '点击麦克风开始游戏',
      micIcon: '🎤',
      micClass: '',
      shaking: false
    })
  },

  // 切换录音状态
  toggleRecording() {
    if (this.data.gameFinished) {
      return
    }

    if (this.data.isListening) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  },

  // 开始录音
  startRecording() {
    const that = this
    
    // 检查录音权限
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              that.doStartRecording()
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '需要录音权限才能进行语音识别',
                showCancel: false
              })
            }
          })
        } else {
          that.doStartRecording()
        }
      }
    })
  },

  // 执行开始录音
  doStartRecording() {
    const that = this
    
    this.setData({
      isListening: true,
      statusText: '正在监听... 请说"高了"或"低了"',
      micClass: 'listening'
    })

    // 使用微信的语音识别API
    wx.startRecord({
      success() {
        console.log('开始录音')
      },
      fail(err) {
        console.error('录音失败:', err)
        that.setData({
          isListening: false,
          statusText: '录音失败，请重试',
          micClass: ''
        })
      }
    })

    // 设置录音超时
    this.recordTimeout = setTimeout(() => {
      that.stopRecording()
    }, 5000) // 5秒后自动停止
  },

  // 停止录音
  stopRecording() {
    const that = this
    
    if (this.recordTimeout) {
      clearTimeout(this.recordTimeout)
    }

    wx.stopRecord({
      success(res) {
        console.log('录音结束，临时文件路径：', res.tempFilePath)
        that.processVoice(res.tempFilePath)
      },
      fail(err) {
        console.error('停止录音失败:', err)
        that.setData({
          isListening: false,
          statusText: '录音失败，请重试',
          micClass: ''
        })
      }
    })

    this.setData({
      isListening: false,
      micClass: ''
    })
  },

  // 处理语音（模拟语音识别）
  processVoice(tempFilePath) {
    const that = this
    
    // 由于微信小程序没有内置的语音识别API，这里使用模拟的方式
    // 在实际项目中，你需要调用第三方语音识别服务
    this.setData({
      statusText: '正在识别语音...'
    })

    // 模拟语音识别结果
    setTimeout(() => {
      that.showVoiceOptions()
    }, 1000)
  },

  // 显示语音选项（替代语音识别）
  showVoiceOptions() {
    const that = this
    
    wx.showActionSheet({
      itemList: ['高了', '低了'],
      success(res) {
        if (res.tapIndex === 0) {
          that.handleVoiceResult('高了')
        } else if (res.tapIndex === 1) {
          that.handleVoiceResult('低了')
        }
      },
      fail() {
        that.setData({
          statusText: '请点击麦克风重新开始'
        })
      }
    })
  },

  // 处理语音识别结果
  handleVoiceResult(command) {
    console.log('识别到指令:', command)

    if (this.data.gameFinished) return

    let { low, high, guessNumber } = this.data

    if (command.includes('高') || command.includes('大')) {
      high = guessNumber - 1
      if (low > high) {
        this.finishGame()
      } else {
        this.makeGuess(low, high)
      }
    } else if (command.includes('低') || command.includes('小')) {
      low = guessNumber + 1
      if (low > high) {
        this.finishGame()
      } else {
        this.makeGuess(low, high)
      }
    } else {
      this.setData({
        statusText: `未识别指令: "${command}"。请说"高了"或"低了"`
      })
    }
  },

  // 进行下一次猜测
  makeGuess(newLow, newHigh) {
    if (newLow > newHigh) {
      this.finishGame()
      return
    }

    const newGuess = Math.floor((newLow + newHigh) / 2)
    const newCount = this.data.guessCount + 1

    this.setData({
      low: newLow,
      high: newHigh,
      guessNumber: newGuess,
      guessCount: newCount,
      statusText: '我在猜测你的数字...'
    })

    // 1秒后自动开始下一轮监听
    setTimeout(() => {
      if (!this.data.gameFinished) {
        this.startRecording()
      }
    }, 1000)
  },

  // 完成游戏
  finishGame() {
    this.setData({
      gameFinished: true,
      isListening: false,
      statusText: '太棒了！我猜对了！',
      micIcon: '✅',
      micClass: 'finished',
      shaking: true
    })

    // 播放成功提示音
    wx.showToast({
      title: '🎉 猜对啦！',
      icon: 'success',
      duration: 2000
    })

    // 震动反馈
    wx.vibrateShort()

    // 移除抖动效果
    setTimeout(() => {
      this.setData({
        shaking: false
      })
    }, 666)
  },

  // 重新开始游戏
  resetGame() {
    this.initGame()
    wx.showToast({
      title: '游戏重新开始',
      icon: 'success',
      duration: 1000
    })
  }
})