const parsePage = require('./parsePage')

const args = process.argv.slice(2)
if (args[0] === 'parsePage') {
  console.log(`running on ${args[1]}`)
  const pageToParse = parseInt(args[1], 10) || 1
  parsePage(pageToParse).then(console.log)
}
