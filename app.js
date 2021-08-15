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
let prevBlockHeight;
let averageMinedPerSecond; // Average mined per second
let averageAddedPerSecond; // Average added blocks per second


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
  if (fs.existsSync(resultsFile)) {
    console.log(timestamp(), yellow('Reading from existing saved data...'));
    ({
      prevMinedHeight,
      prevBlockHeight,
      prevMinedTime,
      averageAddedPerSecond,
      averageMinedPerSecond,
    } = (JSON.parse(await fs.readFileSync(resultsFile))))
  } else {
    const diagnosticResponse = await getDiagnosticsReport()
    prevMinedHeight = diagnosticResponse[diagnosticMapping.MinedHeight]
    prevBlockHeight = diagnosticResponse[diagnosticMapping.BlockHeight]
    prevMinedTime = new Date().getTime()
    await saveStats()
  }
  console.log(timestamp(),
    yellow('Current Stats: Mined Height:'))
  console.log(
    timestamp(),
    yellow('Mined Height:'),
    green(prevMinedHeight),
    yellow('Block Height:'),
    green(prevBlockHeight),
  );
  console.log(
    timestamp(),
    yellow('Average Mined Blocks:'),
    green(averageMinedPerSecond),
    yellow('/s'),
    yellow('Average Added Blocks:'),
    green(averageAddedPerSecond),
    yellow('/s'),
  );
}

async function checkResults() {
  const diagnosticResponse = await getDiagnosticsReport()
  const currentMinedHeight = diagnosticResponse[diagnosticMapping.MinedHeight]
  const currentBlockHeight = diagnosticResponse[diagnosticMapping.BlockHeight]
  const timeMs = new Date().getTime()
  if (currentMinedHeight !== prevMinedHeight) {
    const elapseMinedBlocks = currentMinedHeight - prevMinedHeight
    const elapseBlockHeight = currentBlockHeight - prevBlockHeight
    const remainingBlocks = currentBlockHeight - currentMinedHeight
    const elapseTime = timeMs - prevMinedTime  // Elapse time in seconds
    const blocksMinedPerMinute = ((elapseMinedBlocks / elapseTime) * 1000 * 60).toFixed(2)
    averageMinedPerSecond = approxRollingAverage(averageMinedPerSecond, (elapseMinedBlocks / elapseTime) * 1000)
    const blocksAddedPerMinute = ((elapseBlockHeight / elapseTime) * 1000 * 60).toFixed(2) // Blocks being added to height
    averageAddedPerSecond = approxRollingAverage(averageAddedPerSecond, (elapseBlockHeight / elapseTime) * 1000)

    const {days, hours, minutes, seconds} = getTimeRemaining(
      (elapseTime / (elapseMinedBlocks - elapseBlockHeight)) * remainingBlocks,
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
      green(elapseMinedBlocks.toString()),
      yellow('block in'),
      green(Math.round(elapseTime / 1000)),
      yellow('seconds and '),
      green(elapseBlockHeight),
      yellow('blocks added to block height '),
    )

    console.log(
      timestamp(),
      yellow(`Current Blocks Left to Mine:`),
      green(currentBlockHeight - currentMinedHeight),
      yellow('['),
      green(currentMinedHeight),
      yellow('/'),
      green(currentBlockHeight),
      yellow(']'),
      green(blocksMinedPerMinute),
      yellow('b/mpm'),
      green(blocksAddedPerMinute),
      yellow('b/apm'),
      green(Math.abs(blocksAddedPerMinute - blocksMinedPerMinute).toFixed(2)),
      yellow('Δ'),
    )
    console.log(
      timestamp(),
      yellow(`Estimated Time Remaining: `),
      green(`days: ${days}, hours: ${hours}, minutes: ${minutes}, seconds: ${seconds}`),
    )
    prevMinedHeight = currentMinedHeight
    prevBlockHeight = currentBlockHeight
    prevMinedTime = timeMs
    await saveStats()
  }
}

async function saveStats() {
  await fs.writeFileSync(resultsFile, JSON.stringify({
    prevMinedHeight,
    prevMinedTime,
    prevBlockHeight,
    averageAddedPerSecond,
    averageMinedPerSecond,
  }))
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

const averageOver = 100 // Average over 100 values
function approxRollingAverage(avg, newValue) {
  avg -= avg / averageOver
  avg += newValue / averageOver
  return avg
}
