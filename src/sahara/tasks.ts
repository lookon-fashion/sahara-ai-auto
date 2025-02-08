class SaharaTask {
  name: string
  taskID: string
  galxeTaskId: string | null

  constructor(name: string, taskID: string, galxeTaskId?: string) {
    this.name = name
    this.taskID = taskID
    this.galxeTaskId = galxeTaskId ?? null
  }
}

class SaharaTasks {
  static getAllTaskIds(): string[] {
    return Object.values(this)
      .filter(value => value instanceof SaharaTask)
      .map(task => (task as SaharaTask).taskID)
  }

  static getTaskNameById(taskId: string): string | undefined {
    return Object.values(this)
      .filter(value => value instanceof SaharaTask)
      .find(task => (task as SaharaTask).taskID === taskId)?.name
  }
}

class SaharaDailyTasks extends SaharaTasks {
  static VisitXTask = new SaharaTask("Visit @SaharaLabsAI on X", "1002", "505649247018811392")
  static VisitBlogTask = new SaharaTask("Visit the Sahara AI blog", "1001", "507361624877694976")
  static GenerateTransactionTask = new SaharaTask("Generate at least one transaction on Sahara Testnet", "1004")

}

class SaharaSocialTasks extends SaharaTasks {
  static FollowXTask = new SaharaTask("Follow @SaharaLabsAI on X", "1104", "395230389519589376")
  static LikeSeason2PostTask = new SaharaTask("Like our Season 2 post", "1110", "507370364607660032")
  static LikeLegendsPostTask = new SaharaTask("Like our Legends post", "1105", "507364926881267712")
  static RepostLegendsPostTask = new SaharaTask("Repost our Legends post", "1106", "3319620010")
}

const EXLUDED_TASKS = [
  "1103", // Have the Legend role in Sahara AI Discord Server
  "1102", // Have the Bronze role in Sahara AI Discord Server
  "1101", // Have the Silver role in Sahara AI Discord Server
  "1112", // Have the Gold role in Sahara AI Discord Server
  "1113", // Have the Platinum role in Sahara AI Discord Server
]

export { SaharaDailyTasks, SaharaSocialTasks, SaharaTask }
