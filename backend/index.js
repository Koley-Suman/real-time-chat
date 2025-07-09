import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/index.js";
import app from "./app.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import {Server as SocketIOServer} from "socket.io";
import http from "http";
import cors from 'cors';



dotenv.config({
    path: './env'
});
app.use(express.json());
app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes)
app.use(notFound);
app.use(errorHandler);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


const server = http.createServer(app);

connectToDB().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}).catch((error) => {
    console.error("mongodb connection failed:", error);
}
)

app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true,
}));



const io = new SocketIOServer(server,{
    pingTimeout:60000,
        cors:{
            origin:process.env.FRONT_END_URL,
        }
});

io.on("connection",(socket)=>{
    console.log("connected to socket");
    socket.on('setup',(userId)=>{
        socket.join(userId);
        socket.emit("connected");
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user joined room ",room);
    })
    socket.on("new Message",(newMessage)=>{
        var chat = newMessage?.chat;
        if(!chat || !chat.users) return  console.log("chat or chat.users not defined", newMessage);

        chat.users.forEach(user => {
            if (user._id === newMessage.sender._id)return;
            else{
                socket.in(user._id).emit("message received",newMessage)
            }
                
            
        });
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))
})

