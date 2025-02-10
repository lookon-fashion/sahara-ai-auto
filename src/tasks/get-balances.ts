import Table from "cli-table3"

import { getWallets } from "@/db"
import { Client, Networks } from "@/eth-async"
import { logger } from "@/helpers"

type WalletInfo = {
  name: string;
  balance: string;
  txCount: string;
}

const saharaGetBalances = async () => {
  const wallets = await getWallets()

  const walletsDataPromises = wallets.map(async (wallet): Promise<WalletInfo> => {
    try {
      const client = new Client(wallet.privateKey, Networks.SaharaAI, wallet.proxy)

      const [balance, txCount] = await Promise.all([
        client.wallet.balance(),
        client.provider.getTransactionCount(client.signer.address),
      ])

      return {
        name: wallet.name,
        balance: balance.Ether.toFixed(4),
        txCount: txCount.toString(),
      }
    } catch (error) {
      logger.error(`Failed to get data for ${wallet.name}: ${error}`)
      return {
        name: wallet.name,
        balance: "Error",
        txCount: "-",
      }
    }
  })

  const walletsData = await Promise.all(walletsDataPromises)

  const table = new Table({
    head: ["Name", "Balance", "Transactions"],
    style: {
      head: ["green"],
      border: ["white"],
    },
  })
  walletsData.forEach(data => {
    table.push([
      data.name,
      data.balance,
      data.txCount,
    ])
  })

  console.log(table.toString())
}

export { saharaGetBalances }
