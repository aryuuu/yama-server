const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');
const users = {};

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(require('app/routes'));
app.use(require('app/middlewares/error-handler'));

// app.listen(config.PORT, () => {
//   console.log(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
//   console.log('Started at ', new Date().toUTCString());
// })
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
})

io.on("connection", (socket) => {
    users[socket.username] = {
        userID: socket.id,
        username: socket.username
    }
    // const users = [];
    // for (let [id, socket] of io.of("/").sockets) {
    //     users.push({
    //         userID: id,
    //         username: socket.username,
    //     });
    // }
    // socket.emit("users", users);
    console.log(users);

    socket.on('search user', ({ username }) => {
        const user = users[username];
        socket.emit('search user', {
            username,
            isExist: user !== undefined
        });
    });

    socket.on("private message", ({ content, to }) => {
        console.log(socket.id)
        // socket.emit('ack', 'acknowledged');
        const targetID = users[to] ? users[to].userID : '';
        // console.log(`to ${to}`);
        // console.log(`target id: ${users[to] ? users[to].userID : 'not found'}`);
        // console.log(`message ${content}`)
        // console.log(`sender username: ${socket.username}`);

        if (targetID !== '') {
            console.log(`sending message to: ${targetID}`)
            const message = {
                content,
                from: socket.username,
                to,
            };
            socket.to(targetID).to(socket.id).emit("private message", message);
        }
        socket.emit("private message ack", {
            from: socket.username,
            content
        });
    });

    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            socket.broadcast.emit("user disconnected", socket.userID);
            
        }
    })
});

server.listen(config.PORT, () => {
    console.log(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
    console.log('Started at ', new Date().toUTCString());
})

module.exports = app;
