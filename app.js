// run app providing the host ip address like: 'node app.js 192.168.1.200'
const host = process.argv.slice(2)[0];

if (!host) process.exit();
const {green, yellow, blue, cyan} = require('colors')
const axios = require('axios');
const moment = require('moment')
const fs = require('fs')
const resultsFile = 'data.json' // previously saved results
const httpClient = axios.create({
  baseURL: `http://${host}`,
});

let prevMinedTime; // Last time time height was checked
let prevMinedHeight;
// Diagnostic Response API fields mapping
let diagnosticMapping = {
  BlockHeight: 'BCH',
  MinedHeight: 'MH',
};

const timestamp = () => blue(`[${moment().format()}] `);

(async () => {
  console.log('==================== Nebra Helium Miner Sync Estimate ====================')
  console.log(timestamp(), yellow('Host:'), green(host));
  await init();
  await checkResults()
  setInterval(async () => {
    await checkResults()
  }, 1000)
})();

// Load saved results from file if they exists
async function init() {
  let blockHeight
  if (fs.existsSync(resultsFile)) {
    console.log(timestamp(), yellow('Reading from existing saved data...'))
    const data = JSON.parse(await fs.readFileSync(resultsFile))
    prevMinedHeight = data.prevMinedHeight
    prevMinedTime = data.prevMinedTime
  } else {
    const diagnosticResponse = await getDiagnosticsReport()
    prevMinedHeight = diagnosticResponse[diagnosticMapping.MinedHeight]
    prevMinedTime = new Date().getTime()
    await fs.writeFileSync(resultsFile, JSON.stringify({prevMinedHeight, prevMinedTime}))
  }
}

async function checkResults() {
  const diagnosticResponse = await getDiagnosticsReport()
  const currentMinedHeight = diagnosticResponse[diagnosticMapping.MinedHeight]
  const blockHeight = diagnosticResponse[diagnosticMapping.BlockHeight]
  const timeMs = new Date().getTime()
  if (currentMinedHeight !== prevMinedHeight) {
    const elapseBlocks = currentMinedHeight - prevMinedHeight
    const remainingBlocks = blockHeight - currentMinedHeight
    const elapseTime = timeMs - prevMinedTime  // Elapse time in seconds
    const blocksPerMinute = ((elapseBlocks / elapseTime) * 1000 * 60).toFixed(2)
    const {days, hours, minutes, seconds} = getTimeRemaining(
      (elapseTime / elapseBlocks) * remainingBlocks,
    )
    console.log(cyan(`==================== UPDATE ====================`))

    // console.log(timestamp(),`currentMinedHeight: ${currentMinedHeight}`)
    // console.log(timestamp(), `blockHeight: ${blockHeight}`)
    // console.log(timestamp(), 'elapseBlocks: ', elapseBlocks)
    // console.log(timestamp(), 'remainingBlocks: ', remainingBlocks)
    // console.log(timestamp(), `timeMs: ${timeMs}`)
    // console.log(timestamp(), `prevMinedTime: ${prevMinedTime}`)
    // console.log(timestamp(), 'elapseTime ', elapseTime)

    console.log(
      timestamp(),
      yellow('Mined'),
      green(elapseBlocks.toString()),
      yellow('block in'),
      green(Math.round(elapseTime / 1000)),
      yellow('seconds'),
    )

    console.log(
      timestamp(),
      yellow(`Current Blocks Left to Mine:`),
      green(blockHeight - currentMinedHeight),
      yellow('['),
      green(currentMinedHeight),
      yellow('/'),
      green(blockHeight),
      yellow(']'),
      green(blocksPerMinute),
      yellow('b/m'),
    )
    console.log(
      timestamp(),
      yellow(`Estimated Time Remaining: `),
      green(`days: ${days}, hours: ${hours}, minutes: ${minutes}, seconds: ${seconds}`),
    )
    prevMinedHeight = currentMinedHeight
    prevMinedTime = timeMs
    await fs.writeFileSync(resultsFile, JSON.stringify({prevMinedHeight, prevMinedTime}))
  }
}

async function getDiagnosticsReport() {
  const {data} = (await httpClient.get('/diagnostics.json'))
  data[diagnosticMapping.MinedHeight] = parseInt(data[diagnosticMapping.MinedHeight])
  return data
}

function getTimeRemaining(remainingTime) {
  const seconds = Math.floor((remainingTime / 1000) % 60);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

  return {
    total: remainingTime,
    days,
    hours,
    minutes,
    seconds,
  };
}
