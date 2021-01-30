const io = require("socket.io")
const socket_port = 4000;
const server = io.listen(socket_port)

console.log(`Socket listening on port ${socket_port}`);

const game = {
    question: null,
    answers: null,
    players: {}
}

server.on("connection", socket => {
    const { id } = socket.client;

    socket.on("new-player", playerID => {
        console.log(playerID)
    })

    socket.on("disconnect", () => {
        console.log("Client disonnected")
    })

    console.log("Client connected", id)
});