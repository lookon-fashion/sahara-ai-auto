const claimGalxe = async (client: WClient) => {
  await client.galxe.signIn()

  await sleep(2)
  await client.galxe.handleVisitPageTask({ taskId: "505649247018811392", campaignId: "GCNLYtpFM5" })
  await sleep(2)
  await client.galxe.claimTask("505649247018811392")

  await sleep(3)

  await client.galxe.handleVisitPageTask({ taskId: "507361624877694976", campaignId: "GCNLYtpFM5" })
  await sleep(3)
}

const claimSahara = async (client:WClient, ref:string) => {

  const isSignedIn = await client.sahara.signin(ref)

  if (!isSignedIn) throw new Error("Can't sign in to Sahara")

  await sleep(2)
  await client.sahara.claimTask(SaharaTasks.VisitXTask)
  await sleep(3)
  await client.sahara.claimTask(SaharaTasks.VisitBlogTask)

  if (await client.evmClient.wallet.balance()) {

    await sleep(3)
    await client.sahara.claimTask(SaharaTasks.GenerateTransactionTask)
  }

}
