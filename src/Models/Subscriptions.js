import fs from 'fs'

export default {
  data: [],

  file: `${process.env.PWD}/public/subscriptions.json`,

  add(params) {
    this._load()

    this.data.push(params)

    this._save()
  },

  delete(userId, channelId) {
    this._load()

    this.data = this.data.filter(item => !(item.user === userId && item.channel.id === channelId))

    this._save()
  },

  getSubscription(userId, channelId) {
    return this.data.find(item => item.user === userId && item.channel.id === channelId)
  },

  isUserSubscribedToChannel(userId, channelId) {
    return !!this.data.find(item => item.user === userId && item.channel.id === channelId)
  },

  getUserSubscriptions(userId) {
    return this.data.filter(item => item.user === userId)
  },

  _load() {
    if (fs.existsSync(this.file)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      } catch (error) {
        this.data = []
      }
    }
  },

  _save() {
    fs.writeFileSync(this.file, JSON.stringify(this.data))
  }
}