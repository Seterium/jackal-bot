import dotenv from 'dotenv'

import JackalCli from '#@/Services/JackalCli.js'
import Mongoose from '#@/Services/Mongoose.js'
import JCB from '#@/Services/JCB.js'

dotenv.config()

JCB.init()
Mongoose.init()
JackalCli.init()