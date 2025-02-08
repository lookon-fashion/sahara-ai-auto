import { Client } from "@/eth-async/client"
import { Galxe } from "@/galxe"
import { Sahara } from "@/sahara"

class GlobalClient {
  name: string
  evmClient: Client
  galxe: Galxe
  sahara: Sahara
  ref: string
  proxy: string | null

  constructor(name: string, evmClient: Client, ref: string) {
    this.name = name
    this.ref = ref
    this.evmClient = evmClient
    this.proxy = evmClient.proxy
    this.galxe = new Galxe(this)
    this.sahara = new Sahara(this)
  }
}

export { GlobalClient }
