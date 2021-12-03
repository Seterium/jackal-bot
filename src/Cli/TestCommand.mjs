import Mongoose from 'mongoose'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

export default {
  command: 'test',

  description: 'Feature testing command',

  async handler () {
    // Create
    // const subscription = new SubscriptionsModel.model({
    //   channel: 'UCsJR1qQDNyFvsX_9_bNM63A',
    //   user: 123123123
    // })
    //
    // await subscription.save()

    // Read
    // const subscription = await SubscriptionsModel.model.findById('61aa8f96e19952e4bc199cc2')
    //
    // console.log(subscription)

    // Update
    // const subscription = await SubscriptionsModel.model.findById('61aa8f96e19952e4bc199cc2')
    //
    // subscription.notifications = true
    //
    // await subscription.save()

    // Delete
    // const subscription = await SubscriptionsModel.model.findById('61aa8f96e19952e4bc199cc2')
    
    // await subscription.delete()

    // Find
    // const subscription = await SubscriptionsModel.model.findOne({
    //   channel: 'UCsJR1qQDNyFvsX_9_bNM63A',
    //   user: 123123123
    // }).exec()
    // console.log(subscription.id)

    // Mongoose.connection.close()
  }
}