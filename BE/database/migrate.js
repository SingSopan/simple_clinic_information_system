require('dotenv').config()
const fs = require('fs')
const path = require('path')
const db = require('../src/config/db')

async function run() {
  const directory = path.join(__dirname, 'migrations')
  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.sql')).sort()
  for (const file of files) {
    await db.query(fs.readFileSync(path.join(directory, file), 'utf8'))
    console.log(`Applied ${file}`)
  }
  await db.end()
}

run().catch(async (error) => { console.error(error); await db.end(); process.exit(1) })
