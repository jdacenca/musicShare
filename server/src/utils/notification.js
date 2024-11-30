import { Server } from 'socket.io';
import http from 'http';

export let server = null
export let io = null


export const startSocketIOServer = async function(app) {
    server = http.createServer(app)
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });


    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
      
        // Register a user with a nickname and join their personal room
        socket.on("register_user", (username) => {
            
            if (typeof username !== "string") {
                console.log(
                `Error: username is required for user ${socket.id} to join the chat.`
                );
                return;
            }
      
          socket.join(username);
          socket.username = username;
          console.log(`User ${socket.id} has joined with username: ${username}`);
        });
      

        // Handle notification
        /*
        {
            "id":1,
            "username": "pgounalan",
            "title": "Musik Freak",
            "time": "5h",
            "userImage": "user1",
            "description": "Check out this awesome track!",
            "likes": 10,
            "comments": [
                { "username": "user1", "text": "Love This!" },
                { "username": "user2", "text": "Love This!" }
            ],
            "videoUrl": "https://www.youtube...."
        }
        */
        socket.on("notification", (data) => {
          if (!socket.username) {
            console.log(
              `Error: User ${socket.id} must set a username before sending a message.`
            );
            return;
          }
      
          const notification = {
            id: data.id,
            username: data.username,
            title: data.title,
            time: data.time,
            userImage: data.userImage,
            description: data.description,
            likes: data.likes,
            comments: data.comments,
            videoUrl: data.videoUrl
          };
          io.emit("notification", notification);
        });
      
        socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.id}`);
        });
      });
}