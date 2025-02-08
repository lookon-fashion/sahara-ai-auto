type SignInResponseTypes = {
    id: string  ,
    username: string,
    accessToken: string,
    accessTokenExpireAt: string,
    accessTokenExpireTime: string,
    refreshToken: string,
    refreshTokenExpireAt: string,
    refreshTokenExpireTime: string
}

type ChallengeResponseTypes = { challenge: string }

type ClaimTaskResponseTypes = [ { type: string, assetID: string, amount: string } ] | void

type GetTokensFromFaucetSuccessResponseTypes = {
  msg: `Txhash:${string}`
}

type GetTokensFromFaucetErrorResponseTypes = {
  msg: string
}

type DataBatchResponseTypes = {
  [key: string]: {
    status: "1" | "2" | "3" // 1 - Not started, 2 - Ready but not claimed, 3 - Done
    subTaskID: string
  }
}

type Task = {
  id: string
  name: string
  description: string
  requirement: string
  repeat: "daily" | "once"
  type: "galxe_daily" | "indexer_daily" | "galxe" | "annotation" | "annotation_repeat" | "referral_daily" | "referral_repeat"
  rewards: Array<{
    type: string
    assetID: string
    amount: string
  }>
  url: string
  params: {
    credentialID: string
    difficulty: string
    finishPoint: string
    referralCount: string
  }
}

type ConfigTableResponseTypes = {
  maps: Array<{
    id: string
    name: string
    progress: string
    shardID: string
    nftID: string
    backgroundStory: string
    shardTitle: string
    nftTitle: string
    taskGroups: Array<{
      id: string
      name: string
      tasks: Array<{ taskID: string }> | null
    }>
  }>
  assetMap: {
    [key: string]: {
      id: string
      name: string
      description: string
      combine: {
        assets: Array<{
          assetID: string
          amount: string
        }> | null
      }
    }
  }
  taskMap: {
    [key: string]: Task
  }
  referral: {
    activateTasks: number[]
  }
  leaderBoard: {
    rankWeeks: Array<{
      id: string
      startDate: string
      endDate: string
      rewardsDescription: string
      rankDescription: string
      ranks: Array<{
        rank: string
        rewards: Array<{
          type: string
          assetID: string
          amount: string
        }>
      }>
    }>
  }
  i18n: {
    assetChange: {
      [key: string]: {
        [key: string]: {
          [key: string]: string
        }
      }
    }
  }
  links: {
    facuet: string
    twitter: string
    instagram: string
    discrod: string
    telegram: string
  }
}

export { ChallengeResponseTypes, ClaimTaskResponseTypes, ConfigTableResponseTypes, DataBatchResponseTypes, GetTokensFromFaucetErrorResponseTypes, GetTokensFromFaucetSuccessResponseTypes, SignInResponseTypes, Task }
