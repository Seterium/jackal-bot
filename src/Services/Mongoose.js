import Mongoose from 'mongoose'

export default {
  async init() {
    const {
      DB_HOST,
      DB_PORT,
      DB_NAME
    } = process.env

    await Mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
      keepAlive: false
    })
  },
}