import { Hono } from 'hono'
import patterns from "./patterns.json"
import configs from "./configs.json"
import { logger } from 'hono/logger'
import { PrettyConsole } from './prettyConsole'

const prettyConsole = new PrettyConsole();
prettyConsole.clear();

type serverConnectRequest = {
  license_key: string,
  port: string,
  version: string,
  ip: string,
  reqconfigs: string[]
}

const app = new Hono()
app.use(logger())

app.get('/', (c) => {
  return c.text('SELAX Elite Ultimate API')
})


// ! SELAX Fetch Configs Request (POST)
// ? Note: This request has usually a SLX-API-Auth header but we dont really give a shit so no auth required.
// * Returns: An simple json array with all configs that are available to be requests upon server connect.
app.post('/fetchconfigs', async (c) => {
  return c.json({
    "configs": configs.requestConfigs
  })
})

// ! SELAX Server Connection Request (POST)
// ? Note: Same as for the request above, licensing doesnt really matter in this instance so no license is read.
// * Required: "reason" can be one of 'disabled', 'expired', 'wrongipport'
// * Required: "edition" needs to include 'ELITE' but can be suffixed with 'DEVTOOLS' and/or 'SIREN' for development mode or swedish sirens mode. (Swedish sirens mode requires appropriate files)
// * Required?: "latestversion" is supposed to be the version of your selax installation. Latest as of typing this is v1.21.
// * Required: "recconfigs" is the configs that your server has requested for any Alvuten/Elle Modding vehicles with Selax Elite compatibility. It grabs the configs for the IDs you provided.
// * Required: "patterns" is the default patterns for any non Selax Elite compatible vehicles. Has a default value.
// * Optional: "notice" is a message that will be displayed in the server console. Not used in this case.
// * Optional: "paymentlink" is a link that will be promted to the user for manual payment. Not used in this case.
// * Optional: "timetorenew" is the remaining duration until the IP can be changed for the present license. Not used in this case.
app.post('/serverconnect', async (c) => {
  const req = await c.req.json() as unknown as serverConnectRequest

  const returningConfigs: any[] = configs.returnConfigs.filter((config) => {
    return req.reqconfigs.includes(config.identifier)
  })

  prettyConsole.log('Server Connect Request:')
  prettyConsole.log(`License Key: ${req.license_key}`)
  prettyConsole.log(`Port: ${req.port}`)
  prettyConsole.log(`Version: ${req.version}`)
  prettyConsole.log(`IP: ${req.ip}`)
  prettyConsole.log(`Requested Configs: ${req.reqconfigs}`)

  return c.json({
    "reason": "ok",
    "edition": "ELITEDEVTOOLS",
    "latestversion": 1.21,
    "recconfigs": returningConfigs,
    "patterns": patterns
  })
})

export default {
  port: 4000,
  fetch: app.fetch,
}
