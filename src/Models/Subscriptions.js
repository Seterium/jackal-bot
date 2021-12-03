import mongoose from 'mongoose'

export default {
  table: 'subscriptions',

  schema: new mongoose.Schema({
    channel: {
      type: String,
      required: true
    },
    user: {
      type: Number,
      required: true
    },
    notifications: {
      type: Boolean,
      default: false
    }
  }),

  get model() {
    return mongoose.model(this.table, this.schema)
  } 
}