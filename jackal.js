import dotenv from 'dotenv'

import JackalBot from '#@/Services/JackalBot.js'
import Mongoose from '#@/Services/Mongoose.js'

dotenv.config()

Mongoose.init()
JackalBot.init()