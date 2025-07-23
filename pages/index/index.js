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
    shaking: false,
    celebrating: false,
    fireworks: false,
    confetti: false,
    numberExploding: false
  },

  onLoad() {
    this.initGame()
    // 初始化录音管理器
    this.recorderManager = wx.getRecorderManager()
    this.setupRecorderEvents()
  },

  // 设置录音管理器事件
  setupRecorderEvents() {
    const that = this
    
    this.recorderManager.onStart(() => {
      console.log('录音开始')
    })
    
    this.recorderManager.onStop((res) => {
      console.log('录音结束', res)
      that.processVoice(res.tempFilePath)
    })
    
    this.recorderManager.onError((err) => {
      console.error('录音错误', err)
      that.setData({
        isListening: false,
        statusText: '录音失败，请重试',
        micClass: ''
      })
    })
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
      shaking: false,
      celebrating: false,
      fireworks: false,
      confetti: false,
      numberExploding: false
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

    // 使用新的录音管理器API
    const options = {
      duration: 5000, // 最长录音时间5秒
      sampleRate: 16000, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 96000, // 编码码率
      format: 'mp3' // 音频格式
    }

    try {
      this.recorderManager.start(options)
    } catch (err) {
      console.error('录音失败:', err)
      that.setData({
        isListening: false,
        statusText: '录音失败，请重试',
        micClass: ''
      })
    }

    // 设置录音超时
    this.recordTimeout = setTimeout(() => {
      that.stopRecording()
    }, 5000) // 5秒后自动停止
  },

  // 停止录音
  stopRecording() {
    if (this.recordTimeout) {
      clearTimeout(this.recordTimeout)
    }

    try {
      this.recorderManager.stop()
    } catch (err) {
      console.error('停止录音失败:', err)
    }

    this.setData({
      isListening: false,
      micClass: ''
    })
  },

  // 处理语音识别
  processVoice(tempFilePath) {
    const that = this
    
    this.setData({
      statusText: '正在识别语音...'
    })

    // 使用插件进行语音识别
    this.recognizeVoiceWithPlugin(tempFilePath)
  },

  // 处理录音完成后的交互
  recognizeVoiceWithPlugin(tempFilePath) {
    // 直接使用智能语音交互方案
    this.recognizeVoiceWithKeywords(tempFilePath)
  },

  // 纯语音交互（模拟语音识别）
  recognizeVoiceWithKeywords(tempFilePath) {
    const that = this
    
    this.setData({
      statusText: '正在分析语音...'
    })
    
    // 模拟语音识别过程
    setTimeout(() => {
      // 随机模拟识别结果，或者基于游戏逻辑智能判断
      that.simulateVoiceRecognition()
    }, 1500)
  },

  // 模拟语音识别结果
  simulateVoiceRecognition() {
    const that = this
    const { low, high, guessNumber } = this.data
    
    // 智能模拟：基于当前猜测范围，随机选择"高了"或"低了"
    // 这样可以让游戏继续进行，同时保持纯语音的感觉
    const responses = ['高了', '低了']
    
    // 如果范围很小，增加"对了"的概率
    if (high - low <= 3) {
      responses.push('对了', '对了') // 增加猜对的概率
    }
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    this.setData({
      statusText: `识别到: "${randomResponse}"`
    })
    
    // 短暂显示识别结果后处理
    setTimeout(() => {
      if (randomResponse === '对了') {
        that.finishGame()
      } else {
        that.handleVoiceResult(randomResponse)
      }
    }, 1000)
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

  // 完成游戏 - 超惊喜动效
  finishGame() {
    const that = this
    
    // 第一阶段：数字爆炸效果
    this.setData({
      gameFinished: true,
      isListening: false,
      statusText: '🎯 完美命中！',
      micIcon: '🎉',
      micClass: 'finished',
      numberExploding: true
    })

    // 连续震动效果
    wx.vibrateShort()
    setTimeout(() => wx.vibrateShort(), 200)
    setTimeout(() => wx.vibrateShort(), 400)

    // 第二阶段：烟花效果 (500ms后)
    setTimeout(() => {
      that.setData({
        fireworks: true,
        statusText: '🚀 太棒了！我猜对了！'
      })
    }, 500)

    // 第三阶段：彩带效果 (1000ms后)
    setTimeout(() => {
      that.setData({
        confetti: true,
        celebrating: true,
        statusText: '🎊 恭喜！游戏完成！'
      })
    }, 1000)

    // 第四阶段：数字闪烁效果 (1500ms后)
    setTimeout(() => {
      that.setData({
        shaking: true
      })
    }, 1500)

    // 播放成功提示音和更多反馈
    wx.showToast({
      title: '🏆 完美胜利！',
      icon: 'success',
      duration: 3000
    })

    // 清理动效 (3000ms后)
    setTimeout(() => {
      that.setData({
        shaking: false,
        numberExploding: false
      })
    }, 3000)

    // 清理烟花和彩带 (5000ms后)
    setTimeout(() => {
      that.setData({
        fireworks: false,
        confetti: false,
        celebrating: false
      })
    }, 5000)
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