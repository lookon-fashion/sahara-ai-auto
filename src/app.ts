import chalk from "chalk"
import prompts from "prompts"

import { checkCaptchaKeys } from "@/config"
import { createDatabase } from "@/db"
import { createCsvTemplate, importWallets, logAuthor } from "@/helpers"
import { handleFaucet, saharaGetBalances, saharaOnchainTransactionSend } from "@/tasks"

import "dotenv/config"

enum ActionEnum {
  CREATE_CSV = "createCsv",
  IMPORT_CSV = "importCsv",
  HANDLE_FAUCET = "handleFaucet",
  HANDLE_ONCHAIN_TRANSACTION = "handleOnchainTransaction",
  GET_BALANCES = "getBalances",
}

type Choice = {
  title: string;
  value: ActionEnum;
  description: string;
}

const isRequiresCaptcha = (action: ActionEnum): boolean => {
  return [
    ActionEnum.HANDLE_FAUCET,
    ActionEnum.HANDLE_ONCHAIN_TRANSACTION,
  ].includes(action)
}

const handleAction = async (action: ActionEnum): Promise<void> => {
  if (isRequiresCaptcha(action) && !checkCaptchaKeys()) {
    console.log(chalk.yellow("Please set your CAPTCHA keys in config.yaml and try again"))
    return
  }

  switch (action) {
  case ActionEnum.IMPORT_CSV:
    await importWallets()
    return
  case ActionEnum.CREATE_CSV:
    createCsvTemplate()
    return
  case ActionEnum.HANDLE_FAUCET:
    await handleFaucet()
    return
  case ActionEnum.HANDLE_ONCHAIN_TRANSACTION:
    await saharaOnchainTransactionSend()
    return
  case ActionEnum.GET_BALANCES:
    await saharaGetBalances()
    return
  }
}

const main = async () => {
  logAuthor()
  await createDatabase()

  const response = await prompts({
    type: "select",
    name: "action",
    message: "Choose option",
    choices: [
      { title: "Create CSV template", value: ActionEnum.CREATE_CSV, description: "Create CSV template file" },
      { title: "Import data from CSV", value: ActionEnum.IMPORT_CSV, description: "Import your wallets from CSV to DB" },
      { title: "Handle Faucet", value: ActionEnum.HANDLE_FAUCET, description: "Get tokens from faucet" },
      { title: "Handle Onchain Transaction", value: ActionEnum.HANDLE_ONCHAIN_TRANSACTION, description: "Send tokens to wallets" },
      { title: "Get Balances", value: ActionEnum.GET_BALANCES },
    ] as Choice[],
  }) as prompts.Answers<"action"> & { action: ActionEnum }

  await handleAction(response.action)
}

main()
