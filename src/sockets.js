const Chat = require('./models/chat');

module.exports = function (io) {

    let users = {};

    io.on('connection', async socket => {
        console.log('Nuevo Ususario conectado!!!!!!!!');

        let messages = await Chat.find({});
        socket.emit('load old messages', messages);

        socket.on('new user', (data, cb) => {
            console.log(data);
            if(data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNickNames();
            }
        });

        socket.on('send message', async(data, cb) => {

            var msg = data.trim();

            if(msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substr(0, index);
                    var msg = msg.substr(index + 1);
                    if (name in users) {
                        users[name].emit('wisper', {
                            msg,
                            nick: socket.nickname
                        });
                    }else {
                        cb('error!!, Ingresa un usuarios que este activo');
                    }
                }else {
                    cb('Error!!!,  Porfavor ingresa tu mensaje');
                }
            }else {
                // console.log(data);
               var newMsg = new Chat({
                    msg: msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickname
            });    
           }
        });

        socket.on('disconnect', data => {
             if(!socket.nickname) return;
             delete users[socket.nickname];
             updateNickNames();
        });

        function updateNickNames() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}