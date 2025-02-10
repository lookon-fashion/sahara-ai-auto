import { getWallets } from "@/db"
import { Client, Networks } from "@/eth-async"
import { GlobalClient } from "@/GlobalClient"
import { checkProxy,logger, shuffleArray  } from "@/helpers"

const handleFaucet = async () => {
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

    promises.push(client.sahara.getTokensFromFaucet())

  }

  await Promise.all(promises)
}

export { handleFaucet }
