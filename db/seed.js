const { PromisedDatabase } = require('promised-sqlite3')
const db = new PromisedDatabase()

async function seed(){
    try{
        await db.open('./db/message.db')
        await db.run(`
        INSERT INTO departments ('name') VALUES
         ('IT'),
         ('Finance'),
         ('Human Resources'),
         ('Marketing'),
         ('Production'),
         ('Research')
     `)
        await db.close()
        console.log('Dummy data is inserted ')
    }
    catch (err){
        console.error('error')
    }
}
seed()