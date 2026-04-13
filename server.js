const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let usuarios = [];

io.on("connection", (socket) => {

    socket.on("digitando", (nome) => {
    socket.broadcast.emit("digitando", nome);
});

    socket.on("novoUsuario", (nome) => {

        usuarios.push({
            id: socket.id,
            nome: nome
        });

        io.emit("listaUsuarios", usuarios);
    });2
222
    socket.on("chat message", (dados) => {

        io.emit("chat message", dados);

    });

    socket.on("disconnect", () => {

        usuarios = usuarios.filter(u => u.id !== socket.id);

        io.emit("listaUsuarios", usuarios);

    });

});

http.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});