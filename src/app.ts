import chalk from "chalk"
import fs from "fs"
import prompts from "prompts"

import { checkCaptchaKeys, CSV_DATA_PATH } from "@/config"
import { createDatabase } from "@/db"
import { importWallets, logAuthor } from "@/helpers"

import { handleAll } from "./farmAsync"

import "dotenv/config"

const createCsvTemplate = () => {
  const headers = ["name", "private key", "proxy"]
  const csvContent = headers.join(",") + "\n"

  fs.writeFileSync(CSV_DATA_PATH, csvContent, "utf-8")

  console.log("----------")
  console.log()
  console.log(chalk.green(`CSV template created at: ${CSV_DATA_PATH}`))
  console.log()
  console.log("----------")
}

const main = async () => {
  logAuthor()
  await createDatabase()

  const response = await prompts({
    type: "select",
    name: "action",
    message: "Choose option",
    choices: [
      { title: "Create CSV template", value: "createCsv", description: "Create CSV template file" },
      { title: "Import data from CSV", value: "importCsv", description: "Import your wallets from CSV to DB" },
      { title: "Farm", value: "farm", description: "Just farm" },
    ],
  })

  if (response.action === "importCsv") await importWallets()
  if (response.action === "createCsv") createCsvTemplate()
  if (response.action === "farm") {
    if (!checkCaptchaKeys()) {
      console.log(chalk.yellow("Please set your CAPTCHA keys in config.yaml and try again"))
      return
    }

    await handleAll()
  }
}

main()
