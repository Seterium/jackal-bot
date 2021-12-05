import Mongoose from 'mongoose'

export default {
  async init() {
    const {
      DB_URL,
      DB_NAME
    } = process.env
    
    await Mongoose.connect(`${DB_URL}/${DB_NAME}`)
  },
}