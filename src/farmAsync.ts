import Decimal from "decimal.js"

import { Client } from "./eth-async/client"
import { Networks } from "./eth-async/data/models"
import { getWallets } from "./db"
import { GlobalClient } from "./GlobalClient"
import { getRandomNumber, logger,sleep } from "./helpers"
import { checkProxy } from "./proxyChecker"
import { SaharaDailyTasks } from "./sahara"

const claimGalxe = async (client: GlobalClient) => {
  await sleep(getRandomNumber(1, 15, true))

  await client.galxe.handleVisitPageTask({ taskId: "505649247018811392", campaignId: "GCNLYtpFM5" })
  await sleep(getRandomNumber(3, 10, true))
  await client.galxe.claimTask("505649247018811392")

  await sleep(getRandomNumber(3, 10, true))

  await client.galxe.handleVisitPageTask({ taskId: "507361624877694976", campaignId: "GCNLYtpFM5" })
  await sleep(getRandomNumber(3, 10, true))
  await client.galxe.claimTask("507361624877694976")
}

const claimSahara = async (client: GlobalClient) => {
  await client.sahara.getTokensFromFaucet()

  await sleep(getRandomNumber(10, 30, true))
  await client.sahara.claimTask(SaharaDailyTasks.VisitXTask)
  await sleep(getRandomNumber(1, 5, true))
  await client.sahara.claimTask(SaharaDailyTasks.VisitBlogTask)

  const balance = (await client.evmClient.wallet.balance()).Ether

  if (balance.greaterThan(new Decimal("0.0001"))) {
    await client.sahara.sendTokens()
    await sleep(getRandomNumber(5, 10, true))
    await client.sahara.claimTask(SaharaDailyTasks.GenerateTransactionTask)
  }
}

const handleAll = async () => {
  const wallets = await getWallets()
  const promises: Promise<void>[] = []

  for (const wallet of wallets) {
    if (!wallet.proxy) {
      logger.error(`Wallet ${wallet.address} has no proxy configured, skipping...`)
      continue
    }

    // Check proxy before adding wallet to execution queue
    const proxyCheck = await checkProxy(wallet.proxy)
    if (!proxyCheck.isWorking) {
      logger.error(`Proxy check failed for wallet ${wallet.address}: ${proxyCheck.error}`)
      continue
    }

    const client = new GlobalClient(wallet.name, new Client(wallet.privateKey, Networks.SaharaAI), wallet.refCode || "")

    promises.push(claimGalxe(client))
    promises.push(claimSahara(client))

  }

  await Promise.all(promises)
}

export { handleAll }
