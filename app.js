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

app.get('/mess', async(req, res)=>{
    try{
        await db.open('./db/message.db')
        const messages = await db.all('SELECT * FROM messages');
        await db.close()
        res.render('messages', {messages})
        }
        catch(err){
            return err
        }
})

app.get('/messages', async (req,res) => {
    
    let page = req.query.ofset
    let limit = 4
    let count = await totalPage()
   if(!page)
    {
        page = 0
    }
    else if(page == 1 )
    {
        page = 0
    }
    await db.open('./db/message.db')
    const messages = await db.all(`SELECT * FROM messages  limit ${limit} OFFSET ${page}`);
    await db.close()
    res.render('messages', {messages, count})
 })
async function totalPage(){
    await db.open('./db/message.db')
    const messages = await db.get('SELECT COUNT(*) AS message_id FROM messages');
    await db.close()
    let count = Math.ceil(messages.message_id / 4)
    return count   
}
app.listen(8000)
