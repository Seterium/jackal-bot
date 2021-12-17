import dotenv from 'dotenv'

import JackalBot from '#@/Services/JackalBot.js'
import JCB from '#@/Services/JCB.js'

dotenv.config()

JCB.init()
JackalBot.init()