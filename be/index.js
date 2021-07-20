const express = require('express');
const app = express();
const socketio = require('socket.io');
const cors = require('cors');
const router = require('./router');
const users = require('./users');
const { Socket } = require('dgram');
const port = 3001;
const http = require('http').createServer(app);

app.use(cors(http));
app.use(router);

const io = socketio(http);

io.on('connect', (socket) => {
    
    socket.on('join', ({ name, room }, callback) => {
        let text = name + ' Telah bergabung';
        const store = users.store({ id:socket.id, name, room });
        console.log('Join ' +socket.id);
        console.log(users.all());
        if (store.error) { 
            callback({ error: store.error });
        } else { 

            user = store.user;
            
            socket.join(user.room);
            io.to(user.room).emit('message', { user: {
                name:"Admin"
            }, text });
            
            callback({user});
        }
    });
    
    socket.on('sendMessage', ({uid, message}) => {
        let user = users.find(uid);
        console.log('send ' + uid)
        if (user) {
            io.to(user.room).emit('message', {
                user: {
                    name: user.name
                }, 
                text: message
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnect '+socket.id);
        let user = users.find(socket.id);
        if (user) {
            
            let text = user.name + ' Sambungan terputus';
    
            io.to(user.room).emit('message', { user: {
                id:0,
                name:"Admin"
            }, text });
    
            users.destroy({ room: user.room, name: user.name });
        }
        console.log(users.all());
    })
});


http.listen(port, () => {
    console.log('Server is running');
})