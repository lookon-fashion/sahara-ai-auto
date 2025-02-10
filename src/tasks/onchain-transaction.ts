import Decimal from "decimal.js"

import { getWallets } from "@/db"
import { Client, Networks } from "@/eth-async"
import { GlobalClient } from "@/GlobalClient"
import { checkProxy,getRandomNumber, logger, shuffleArray  } from "@/helpers"
import { SaharaDailyTasks } from "@/sahara"

const handleFaucetTx = async (client: GlobalClient) => {
  const balance = (await client.evmClient.wallet.balance()).Ether

  const amountToSend = getRandomNumber(0.0001, 0.002)

  if (balance.greaterThan(new Decimal(amountToSend))) {
    const isTxSuccessful = await client.sahara.sendTokens(amountToSend)

    if (isTxSuccessful) {
      await client.sahara.claimTask(SaharaDailyTasks.GenerateTransactionTask)
    }
  }
}

const saharaOnchainTransactionSend = async () => {
  const wallets = shuffleArray(await getWallets())

  const promises: Promise<void>[] = []

  for (const wallet of wallets) {
    if (!wallet.proxy) {
      logger.error(`Wallet ${wallet.name} has no proxy configured, skipping...`)
      continue
    }

    const proxyCheck = await checkProxy(wallet.proxy)
    if (!proxyCheck.isWorking) {
      logger.error(`Proxy check failed for wallet ${wallet.name}: ${proxyCheck.error}`)
      continue
    }

    const client = new GlobalClient(wallet.name, new Client(wallet.privateKey, Networks.SaharaAI, wallet.proxy), wallet.refCode || "", wallet.proxy)

    promises.push(handleFaucetTx(client))

  }

  await Promise.all(promises)

}

export { saharaOnchainTransactionSend }
