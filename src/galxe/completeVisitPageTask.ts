const getCompletedVisitPageQuery = ({
  address,
  taskId,
  campaignId,
  captchaOutput,
  passToken,
  lotNumber,
  genTime,
}: {
  address: string
  taskId: string
  campaignId: string
  captchaOutput: string
  passToken: string
  lotNumber: string
  genTime: string
}) => {
  return {
    operationName: "AddTypedCredentialItems",
    variables: {
      input: {
        credId: taskId,
        campaignId: campaignId,
        operation: "APPEND",
        items: [`EVM:${address}`],
        captcha: {
          lotNumber,
          captchaOutput,
          passToken,
          genTime,
        },
      },
    },
    query:
      "mutation AddTypedCredentialItems($input: MutateTypedCredItemInput!) {\n  typedCredentialItems(input: $input) {\n    id\n    __typename\n  }\n}",
  }
}

export { getCompletedVisitPageQuery }
