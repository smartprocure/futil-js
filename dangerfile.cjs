let { danger, markdown, fail, message, warn } = require('danger')
let duti = require('duti')

let args = {
  danger,
  fail,
  message,
  warn,
  markdown,
  config: {
    prNetChangeThreshold: 500,
    personalityNetChangeThreshold: 500,
    recommendedPrReviewers: 1,
  },
}

duti.prAssignee(args)
duti.netNegativePR(args)
duti.bigPr(args)
duti.noPrDescription(args)
duti.requestedReviewers(args)
