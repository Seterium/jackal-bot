import dotenv from 'dotenv'

import JackalBot from '#@/Services/JackalBot.js'
import Mongoose from '#@/Services/Mongoose.js'
import JCB from '#@/Services/JCB.js'

dotenv.config()

JCB.init()
Mongoose.init()
JackalBot.init()