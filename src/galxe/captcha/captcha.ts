import { Solver } from "@2captcha/captcha-solver"
import { AxiosProxyConfig } from "axios"

import { CAPTCHA_RUCAPTCHA_KEY } from "@/config"
import { logger, sleep } from "@/helpers"

import "dotenv/config"

const GALXE_GEETEST_ID = "244bcb8b9846215df5af4c624a750db4"
const TwoCaptchaSolver = new Solver(CAPTCHA_RUCAPTCHA_KEY)

const solverGeeTestCaptcha = async ({ ua, accountName, proxy }: { ua: string; accountName: string; proxy?: AxiosProxyConfig | null }) => {
  logger.info(`Account ${accountName} | Start solving GeeTest captcha`)

  while (true) {
    try {
      const result = await TwoCaptchaSolver.geetestV4({
        pageurl: "https://app.galxe.com/quest",
        captcha_id: GALXE_GEETEST_ID,
        userAgent: ua,
        proxytype: proxy ? proxy.protocol : undefined,
        proxy: proxy ? `${proxy.auth!.username}:${proxy.auth!.password}@${proxy.host}:${proxy.port}` : void 0,
      }).then(e => {
        return e as unknown as TwoCaptchaAnswer
      })

      logger.info(`Account ${accountName} | GeeTest solved`)
      return result
    } catch (e) {
      logger.info(`Account ${accountName} | GeeTest captcha not solved, retrying... Error: ${e}`)
      await sleep(2)
    }
  }
}

type TwoCaptchaAnswer = {
  captcha_id: string
  lot_number: string
  pass_token: string
  gen_time: string
  captcha_output: string
}

export { solverGeeTestCaptcha }
