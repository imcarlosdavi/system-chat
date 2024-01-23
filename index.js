const { Socket } = require('socket.io');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


let usuarios = []
let socketIds = []

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
})


io.on('connection', (socket)=>{
    socket.on('new user', (data)=>{
        if(usuarios.indexOf(data) != -1){
            socket.emit('new user', {success:false})
        }else{
            usuarios.push(data);
            socketIds.push(socket.id);

            socket.emit('new user', {success:true});
            socket.broadcast.emit("hello", "world");
        }
    })
    
    io.to(socket.id).emit('users', usuarios);

    socket.on('chat message', (obj)=>{
        if(usuarios.indexOf(obj.nome) != -1 && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)){
            io.emit('messages chat', obj);
        }else{
            console.log("Error: você não tem permissão para mandar mensagem");
        }
    })

    socket.on('disconnect', () => {
        let id = socketIds.indexOf(socket.id);

        socketIds.splice(id,1);
        usuarios.splice(id,1);
        console.log(socketIds);
        console.log(usuarios);
        console.log('user disconnected');
    });

    
})

http.listen(3000,()=>{
    console.log('Server connected');
})