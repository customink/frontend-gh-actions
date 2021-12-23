const core = require('@actions/core');
const fs = require('fs')

const envVarPattern = /[Environment\sVariables][\n|\r]```[\n|\r]([\S\s]+)```/i

const parseBodyForEnv = (body) => {
  const matched = envVarPattern.exec(body)
  if (matched === null || !matched[1]) return null
  const lines = matched[1].replace(/\r/g, '\n').split('\n').filter(line => {
    const spacelessLine = line.replace(/ /g,'')
    return !(
      (spacelessLine[0] === '#')                   // Not commented
      || (spacelessLine.indexOf('=') === -1)       // Has assigment
      || (spacelessLine.split('=').filter(         // Property formatted assignment
          word=>word.replace(/ /g,'').length > 0
         ).length !== 2)
    )
  })
  if (lines.length === 0) return null
  return lines
}

const main = () => {
  try {
    const ev = JSON.parse(
      fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')
    )
    const isPR = process.env.GITHUB_EVENT_NAME === 'pull_request'
    if (!isPR) {
      console.log('PR Description to dotenv action skipped: Action event is not pull request.')
      return;
    }
    const filename = process.env['INPUT_DOTENV-FILE-NAME']
    const prBody = ev.pull_request.body
    const parsedEnvVariables = parseBodyForEnv(prBody)
    if (parsedEnvVariables === null) {
      console.log('No environment variables parsed')
      return;
    }
    const content = parsedEnvVariables.join('\n')
    console.log('Environment variables detected:\n')
    console.log(content)
    console.log(`\nWriting to file ${filename}`)
    fs.writeFileSync(filename, content)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main();