import express from "express"
import cors from "cors"
import mysql2 from "mysql2"



const {DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env

const app = express()

const port = 3333

app.use(cors())
app.use(express.json())

app.get("/", (request, response)=> {
    const selectCommand = "SELECT name, email FROM Evexplorer_edutec"

    database.query(selectCommand, (error, users) =>{
        if(error){
            console.log(error)
            return
        }

        response.json(users)
    })
})

app.post("/login",(request, response) =>{
    const { email, password } = request.body.user
    const selectCommand = "SELECT * FROM Evexplorer_edutec WHERE email = ?"

    database.query(selectCommand, [email], (error, user) =>{
        if(error){
            console.log(error)
            return
        }

        if(user.length === 0 || user[0].password !== password){
            response.json({ message: "Usuário ou senha incorretos!" })
            return
        }


        response.json({id: user[0].id, name: user[0].name})
    })
} )

app.post("/cadastrar", (request, response) =>{
    const { user } = request.body
    console.log(user)


    const insertCommand = `
        INSERT INTO Evexplorer_edutec(name, email, password)
        VALUES (?, ?, ?)
    `

    database.query(insertCommand, [user.name, user.email, user.password], (error) =>{
        if(error){
            console.log(error)
            return
        }

        response.status(201).json({ message: "Usuário cadastrado com sucesso!" })
    })

    
})



app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})

const database = mysql2.createPool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionLimit: 10
})