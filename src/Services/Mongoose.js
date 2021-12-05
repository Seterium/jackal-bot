import Mongoose from 'mongoose'

export default {
  connection: null,

  async init() {
    const {
      DB_URL,
      DB_NAME
    } = process.env
    
    try {
      global.$mongoose = await Mongoose.connect(`${DB_URL}/${DB_NAME}`)
      
      $jcb.log('Mongoose service initialized')
    } catch (error) {
      $jcb.log('Mongoose service initialization error', error)
    }
  },
}