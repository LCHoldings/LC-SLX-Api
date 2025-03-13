import { Hono } from 'hono'

import patterns from "./patterns.json"
import reqConfigs from "./configs.json"
import { logger } from 'hono/logger'
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest)
}
const app = new Hono()

app.use(logger(customLogger))
app.get('/', (c) => {
  console.log("New / request")
  return c.text('Kurwa')
})

app.get('/', (c) => {
  console.log("New request")
  return c.text('SELAX Elite API')
})

app.post('/fetchconfigs', async (c) => {
  const body = await c.req.json()
  console.log(await c.req.json())
  const config = {
    "configs": [
      "4996584",
      "4610034",
      "4802144",
      "3671192",
      "5290818",
      "5155495",
      "5152124",
      "5119605",
      "11593651",
      "7196940",
      "6873255",
      "7169886",
      "6841572",
      "11398076",
      "7202058",
      "7099089",
      "10391836",
      "10518592",
      "9909060",
      "10073089",
      "8054672",
      "7353188",
      "7378238",
      "9519867",
      "9519359",
      "9517007",
      "8395562",
      "8442355",
      "3989064"
    ]
  }
  return c.json(config)
})

app.post('/serverconnect', async (c) => {
  console.log(await c.req.json())
  return c.json({
    "reason": "ok",
    "edition": "ELITEDEVTOOLS",
    "latestversion": 1.21,
    "recconfigs": reqConfigs,
    "patterns": patterns
  })
})

export default {
  port: 4000,
  fetch: app.fetch,
  // tls: {
  //   cert: Bun.file("api.ellemodding.se.pem"),
  //   key: Bun.file("api.ellemodding.se-key.pem"),
  // },
}
