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
   
    let page = req.query.page 
    let limit = 3 
    let currentPage = 1
    let count = await totalPage()
    if(page){
        page = page
        currentPage = page
    }
    if(page == "next"){
        if(currentPage < count){
        page = currentPage + 1
        currentPage = page
        }else{
            page = count
        }
    }
    if(page == 'previous')
    {
        page = currentPage -1
        currentPage = page
    } else{
        page = 1
        currentPage = page
    }
    currentPage = page
    //page = pageCount(page, count)
    console.log(page)
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
function pageCount(page, count){
    let totalPage = count
    let currentPage = page
    switch(currentPage){
        case '':
            currentPage = 1
        break
        case 'next':
            if(page < totalPage){
                currentPage = currentPage + 1
            }else{
                currentPage = currentPage
            }
        
        break
        case 'previous':
            if(page > 1){
                currentPage = currentPage -1
            }else{
                currentPage = 1
            }
        break
        default:
            currentPage = currentPage
            break
    }
   
}
app.listen(8000)
