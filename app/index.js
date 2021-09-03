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
const userHandler = require('app/handlers/user');
const messageHandler = require('app/handlers/message');
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
    const displayName = socket.handshake.auth.display_name;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    socket.displayName = displayName ? displayName : username;
    next();
})

io.on("connection", (socket) => {
    users[socket.username] = {
        userID: socket.id,
        username: socket.username,
        displayName: socket.displayName
    }

    const newUser = {
        display_name: socket.displayName,
        address: socket.username,
    }

    // userHandler.createUser(newUser);
    // const users = [];
    // for (let [id, socket] of io.of("/").sockets) {
    //     users.push({
    //         userID: id,
    //         username: socket.username,
    //     });
    // }
    // socket.emit("users", users);
    console.log(users);

    socket.on('search user', async ({ username }) => {
        const user = users[username]

        socket.emit('search user', {
            username,
            display_name: user ? user.displayName : '',
            isExist: user !== undefined,
            isOnline: user !== undefined,
        });
    });

    socket.on('search name', async ({ username }) => {
        const user = users[username];
        socket.emit('search name', {
            username,
            display_name: user.displayName,
        });
    })

    socket.on("private message", (req) => {
        const { 
            content, 
            to, 
            room_id,
            type,
            filename,
        } = req;
        console.log(socket.id)
        console.log(`message sent in room ${room_id}`);
        const targetID = users[to] ? users[to].userID : '';

        if (targetID !== '') {
            console.log(`sending message to: ${targetID}`)
            const message = {
                content,
                from: socket.username,
                display_name: users[socket.username].displayName,
                to,
                type,
                filename,
            };
            socket.to(targetID).to(socket.id).emit("private message", message);
        }
        const newMessage = {
            room: room_id,
            from: socket.username,
            display_name: users[socket.username].displayName,
            to: to,
            content: content,
            type: type,
            filename: filename
        }
        // messageHandler.createMessage(newMessage);
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
