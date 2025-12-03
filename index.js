import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import serverless from "serverless-http";

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env

const app = express()
app.use(cors())
app.use(express.json())

const database = mysql2.createPool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionLimit: 10
})

app.get("/", (request, response) => {
    const selectCommand = "SELECT name, email FROM Evexplorer_edutec"
    database.query(selectCommand, (error, users) => {
        if (error) return response.status(500).json(error)
        response.json(users)
    })
})

app.post("/login", (request, response) => {
    const { email, password } = request.body.user

    const selectCommand = "SELECT * FROM Evexplorer_edutec WHERE email = ?"
    database.query(selectCommand, [email], (error, user) => {
        if (error) {
        response.status(500).json(error)
        return
        }
        if (user.length === 0 || user[0].password !== password) {
    return response.json({ message: "Usuário ou senha incorretos!" });
}


        response.json({ id: user[0].id, name: user[0].name })
    })
})

app.post("/cadastrar", (request, response) => {
    const { user } = request.body

    const insertCommand = `
        INSERT INTO Evexplorer_edutec (name, email, password)
        VALUES (?, ?, ?)
    `

    database.query(insertCommand, [user.name, user.email, user.password], (error) => {
        if (error) {
             response.status(500).json(error)
            return
        }
        response.status(201).json({ message: "Usuário cadastrado com sucesso" })
    })
})

export default serverless(app);
