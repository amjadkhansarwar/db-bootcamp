const express = require('express')
const { PromisedDatabase } = require('promised-sqlite3')
const db = new PromisedDatabase()
const app =  express()

app.use(express.static('public'))

app.use( express.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.get('/', async(req,res)=>{
    try{
    await db.open('./db/message.db')
    const departments = await db.all('SELECT * FROM departments');
    res.render('index', {departments})
    await db.close()
    }
    catch(err){
        return err
    }
})

app.post('/message', async(req, res)=>{
    try{
        const {email,title,content,department_id} = req.body
        await db.open('./db/message.db')
         await db.run(`INSERT INTO messages
         ('department_id','title','content','email', 'answered')
        VALUES('${department_id}','${title}','${content}','${email}', 0)`)
        await db.close()
        res.redirect('thanks')
    }
    catch(err){
        console.error('erro')
    }
    
})

app.get('/thanks', (req, res)=>{
    res.render('thanks')
})

app.get('/messages', async(req, res)=>{
    try{
        let totalmessage = await getallMessage()
        console.log(Object.values(totalmessage));
        await db.open('./db/message.db')
        const messages = await db.all('SELECT * FROM messages');
        await db.close()
        res.render('messages', {messages,totalmessage})
        }
        catch(err){
            return err
        }
})
app.get('/messages', (req,res) => {
    req.query // {kalle: 'grillkorv'}
    res.send('')
 })
async function getallMessage(){
    await db.open('./db/message.db')
    const messages = await db.all('SELECT seq FROM sqlite_sequence WHERE name = messages');
    await db.close()
    return messages
}
app.listen(8000)
