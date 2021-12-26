let express=require('express');
let socket=require('socket.io');

let app=express();
app.use(express.static('public'));
let server=app.listen(5000,()=>{
});

let io=socket(server);
io.on('connection',(socket)=>{
    socket.on('beginPath',(data)=>{
        io.sockets.emit('beginPath',data);
    });
    socket.on('setContent',(data)=>{
        io.sockets.emit('setContent',data);
    });
    socket.on('drawStroke',(data)=>{
        io.sockets.emit('drawStroke',data);
    })
})