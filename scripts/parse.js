const parsePage = require('./parsePage')
const getDb = require('./getDb')

const args = process.argv.slice(2)
const COLLECTION = 'ivworld'

function getInsertFunc(db) {
  return function insertToDb(dataArray, pageNum) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION).insertMany(dataArray, (err) => {
        if (err) {
          reject(new Error(`Error while inserting pages: ${pageNum}`))
        }
        console.log(`Added records for pages ${pageNum}`)
        resolve(true)
      })
    })
  }
}

function getRange(start, end) {
  const rangeArray = []
  for (; start <= end; start++) {
    rangeArray.push(start)
  }
  return rangeArray
}

// async function workOnPage(pageNum, insertFunc) {
//   try {
//     const pageData = await parsePage(pageNum)
//     await insertFunc(pageData, pageNum)
//   } catch(e) {
//     console.log(e)
//   }
// }

const startPage = args[0] || 2504
const endPage = 2800
const parallel = 3
async function run() {
  const { db, client } = await getDb()
  const insertFunction = getInsertFunc(db)
  let start = parseInt(startPage, 10)
  while (start <= endPage) {
    const tmpEnd = start + parallel - 1
    const end = Math.min(endPage, tmpEnd)
    const range = getRange(start, end)
    console.log(`Parsing records for pages ${range} start`)
    const promiseArray = range.map(parsePage)
    let dataArray = []
    try {
      await promiseArray.reduce((prev, next) => prev.then(() => next)
          .then((data) => {
            dataArray = dataArray.concat(data)
          }), Promise.resolve())
      // console.log(`Parsing records for pages ${range} end`)
      // insert to db
      await insertFunction(dataArray, range)
    } catch (e) {
      console.log(`Error while adding range ${range}`)
      console.log(e)
      break
    }
    start = end + 1
  }

  console.log('Done')
  client.close()
}

run()
