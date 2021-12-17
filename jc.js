import dotenv from 'dotenv'

import JackalCli from '#@/Services/JackalCli.js'
import JCB from '#@/Services/JCB.js'

dotenv.config()

JCB.init()
JackalCli.init()