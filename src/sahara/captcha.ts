import { Solver } from "@2captcha/captcha-solver"
import axios, { AxiosProxyConfig } from "axios"

import { CAPTCHA_BESTSOLVER_KEY, CAPTCHA_RUCAPTCHA_KEY } from "@/config"
import { logger, sleep } from "@/helpers"

import "dotenv/config"

const API_URL = "https://bcsapi.xyz/api/captcha/hcaptcha"

type HCaptchaParams = {
  page_url: string
  site_key: string
  access_token: string
  invisible?: boolean
  payload?: Record<string, unknown>
  domain?: string
  user_agent?: string
  proxy?: string
  proxy_type?: "http"
  affiliate_id?: string
}

type RecieveCaptchaResponse = {
  id: number
  solution: string
  status: "completed" | "pending"
  user_agent?: string
  resp_key?: string
  error?: SendCaptchaErrorCodesEnum
}

type SendCaptchaResponse = {
  id: number
  status: "submitted"
} | {
  status: "error"
  error: SendCaptchaErrorCodesEnum.INVALID_ACCESS_TOKEN
}

type SolveHCaptchaFuncType = {
  ua: string
  proxy?: string
  accountName?: string
}

const solveHCaptcha1 = async ({ ua, proxy, accountName }: SolveHCaptchaFuncType): Promise<string> => {
  let attempts = 0
  const maxAttemptsBeforePause = 10

  const attemptSolve = async (): Promise<string> => {
    while (true) {
      logger.info(`Account ${accountName} | Start solving HCaptcha`)
      const result = await sendCaptcha(ua, proxy)

      if (result instanceof HCaptchaError) {
        if (result.code === SendCaptchaErrorCodesEnum.INVALID_ACCESS_TOKEN) {
          throw result
        }

        await sleep(2)
        continue
      }

      while (true) {
        attempts++

        try {
          const solution = await getSolvedHCaptcha(result)
          if (!solution) {
            if (attempts % maxAttemptsBeforePause === 0) {
              logger.info(`Account ${accountName} | Made ${attempts} attempts while solving captcha. Taking a 20 seconds break...`)
              await sleep(20)
            }

            await sleep(5)
            continue
          }

          logger.info(`Account ${accountName} | Captcha solved`)
          return solution
        } catch (error) {
          if (error instanceof HCaptchaError && error.code === SendCaptchaErrorCodesEnum.IMAGE_TIMED_OUT) {
            logger.info(`Account ${accountName} | Captcha timed out`)
            throw error
          }

          logger.error(`Account ${accountName} | Captcha error occurred: ${error}`)
          throw error
        }
      }
    }
  }

  return attemptSolve()
}

const TwoCaptchaSolver = new Solver(CAPTCHA_RUCAPTCHA_KEY)

const solveHCaptcha = async ({ ua, accountName, proxy }: { ua: string; accountName: string; proxy?: AxiosProxyConfig | null }) => {
  logger.info(`Account ${accountName} | Start solving HCaptcha captcha`)

  while (true) {
    try {

      const result = await TwoCaptchaSolver.hcaptcha({
        pageurl: "https://faucet.saharalabs.ai/",
        sitekey: "94998d34-914f-4b97-8510-b3dc0d8e4aef",
        userAgent: ua,
        proxytype: proxy ? proxy.protocol : undefined,
        proxy: proxy ? `${proxy.auth!.username}:${proxy.auth!.password}@${proxy.host}:${proxy.port}` : void 0,
      }).then(e => {
        return e as unknown as TwoCaptchaAnswer
      })

      logger.success(`Account ${accountName} | HCaptcha solved`)
      return result
    } catch (e) {
      logger.info(`Account ${accountName} | HCaptcha captcha not solved, retrying... Error: ${e}`)
      await sleep(2)
    }
  }
}

type TwoCaptchaAnswer = {
  status: string
  data: string
}

const sendCaptcha = async (ua: string, proxy?: string): Promise<number | HCaptchaError> => {
  const params: HCaptchaParams = {
    page_url: "https://faucet.saharalabs.ai/",
    site_key: "94998d34-914f-4b97-8510-b3dc0d8e4aef",
    access_token: CAPTCHA_BESTSOLVER_KEY,
    user_agent: ua,
    proxy: proxy,
    proxy_type: "http",
  }

  try {
    const resp = await axios.post<SendCaptchaResponse>(API_URL, params)

    if (resp.data.status === "error") {
      return new HCaptchaError("Captcha submission failed", SendCaptchaErrorCodesEnum.INVALID_ACCESS_TOKEN)
    }

    return resp.data.id
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new HCaptchaError(error.message, error.response?.data?.error || SendCaptchaErrorCodesEnum.UNKNOWN_ERROR)
    }
    return new HCaptchaError("Unknown error occurred", SendCaptchaErrorCodesEnum.UNKNOWN_ERROR)
  }
}

const getSolvedHCaptcha = async (id: number) => {
  try {
    const resp = await axios.get<RecieveCaptchaResponse>(`https://bcsapi.xyz/api/captcha/${id}?access_token=${CAPTCHA_BESTSOLVER_KEY}`)

    if (resp.data.status === "pending") {
      return false
    }

    if (resp.data.error === SendCaptchaErrorCodesEnum.IMAGE_TIMED_OUT) {
      throw new HCaptchaError("Captcha timed out", SendCaptchaErrorCodesEnum.IMAGE_TIMED_OUT)
    }

    return resp.data.solution
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new HCaptchaError(error.message, error.response?.data?.error || error)
    }
    throw new HCaptchaError("Unknown error occurred", error)
  }
}

class HCaptchaError extends Error {
  public code: SendCaptchaErrorCodesEnum | unknown

  constructor(message: string, code: SendCaptchaErrorCodesEnum | unknown) {
    super(message)
    this.name = "HCaptchaError"
    this.code = code
  }
}

enum SendCaptchaErrorCodesEnum {
  INVALID_ACCESS_TOKEN = "access token is invalid or missing",
  WRONG_KEY = "authentication failed",
  TIMED_OUT = "timed out",
  NETWORK_ERROR = "network error",
  NOT_READY = "captcha not ready",
  UNKNOWN_ERROR = "unknown error",
  IMAGE_TIMED_OUT = "image timed out",
}

export { getSolvedHCaptcha, HCaptchaError, SendCaptchaErrorCodesEnum, solveHCaptcha }
