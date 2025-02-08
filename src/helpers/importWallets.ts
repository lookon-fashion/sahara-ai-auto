import chalk from "chalk"
import { parse } from "csv-parse/sync"
import fs from "fs"

import { CSV_DATA_PATH, REF_CODES } from "@/config"
import { getWallet, Wallet } from "@/db"
import { Client } from "@/eth-async"

const DEV_REF_CODE = "NQWD0N"

const importWallets = async () => {
  if (!fs.existsSync(CSV_DATA_PATH)) {
    console.log(chalk.red(`CSV file not found at path: ${CSV_DATA_PATH}`))
    return
  }

  const fileContent = fs.readFileSync(CSV_DATA_PATH, "utf-8")
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  })

  let imported = 0
  let edited = 0
  const total = records.length

  for (const wallet of records) {
    const walletInstance = await getWallet(wallet["private key"])

    if (walletInstance && (walletInstance.proxy !== wallet.proxy || walletInstance.name !== wallet.name)) {
      await Wallet.update({ proxy: wallet.proxy, name: wallet.name }, { where: { privateKey: wallet["private key"] } })
      ++edited
    }

    if (!walletInstance) {
      const client = new Client(wallet["private key"])

      const useDevCode = REF_CODES.length === 0 ? Math.random() < 0.5 : Math.random() < 0.3
      const refCode = useDevCode ? DEV_REF_CODE : REF_CODES[Math.floor(Math.random() * REF_CODES.length)]

      await Wallet.create({ ...wallet, address: client.signer.address, refCode, privateKey: wallet["private key"] })
      ++imported
    }
  }

  console.log("----------")
  console.log()
  console.log(chalk.green("Done!"))
  console.log(chalk.green(`Imported wallets from CSV: ${imported}/${total}`))
  console.log(chalk.green(`Changed wallets: ${edited}/${total}`))
  console.log(chalk.green(`Total: ${total}`))
  console.log()
  console.log("----------")
}

export { importWallets }
