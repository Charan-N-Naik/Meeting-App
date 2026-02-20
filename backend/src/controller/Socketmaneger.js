import { Server, Socket } from 'socket.io'

// on = listen  Code that receives an event.
// emit = send
// io = everyone
// to = specific

let connections = {}// number of connection 
let messages = {}/// messages send
let timeOnline = {}// what time online



export const connectToSocket = (server) => {
    const io = new Server(server,{
        // dont do in the production
        cors:{
            origin:"*",
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });

    // when any connection come do the call back it like doccumet.addEventListner
    io.on("connection", (socket) => {
        console.log("something connected");
        //listing to client heare have same accept-call towords client side also
        // socket.on("join-call", (path) => {
        //     if (connections[path] === undefined) {
        //         connections[path] = []//connections[path] = [socketId1, socketId2, socketId3]
        //         //❌ One room (path)does NOT have one socket ID
        //         // ✅ One room has multiple socket IDs
        //         // ✅ Each socket ID belongs to exactly one user connection
        //     }
        //     // where have many user have same path but they have different id all are conneceted to same socket
        //     connections[path].push(socket.id)

        //     timeOnline[socket.id] = new Date();
        //     for (let a = 0; a < connections[path].length; a++) {//connections["/room1"] = ["id1", "id2", "id3"]
        //         io.to(connections[path][a]).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender']);
        //     }
        //     if (messages[path] !== undefined) {
        //         for (let a = 0; a < messages[path].length; ++a) {
        //             io.to(socket.id).emit("chat-message", messages[path][a]['data'],
        //                 messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
        //         }
        //     }
        // })
        
        socket.on("join-call", (path) => {

            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // connections[path].forEach(elem => {
            //     io.to(elem)
            // })

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })


        socket.on("signal", (toId, messages) => {
            io.to(toId).emit("signal", socket.id, messages);// send to specific room 
        })

        socket.on("chat-message", (data, sender) => {
            // Object.entries
            //Converts an object into an array of [key, value] pairs
            //[
            //   ["/chat",  ["A1", "B1"]],
            //   ["/video", ["C1"]]
            //]

            //array destructuring:=
            // Equivalent to:
            // const temp = Object.entries(connections);
            // const matchingRoom = temp[0];
            // const found = temp[1];
            


            // heare matcing room store the room tha which matches to the socket.id and make the found to true 
            const [matchingRoom,found]=Object.entries(connections)
            .reduce(([room,isFound],[roomKey,roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey,true];
                }
                return [room,isFound]

            //If we haven’t found a room yet AND the socket.id is in this room’s array, then:
            // Return [roomKey, true] → we found the room
            // Otherwise, keep previous [room, isFound]
            },['',false]);

            if(found===true){
                if(messages[matchingRoom]===undefined){
                    messages[matchingRoom]=[];
                }
                messages[matchingRoom].push({'sender':sender,'data':data,"socket-id-sender":socket.id})
                console.log("message",key,":",sender,data);
                connections[matchingRoom].forEach(element => {
                    io.to(element).emit("chat-message",data,sender,socket.id)
                });
            
            }
        })
        socket.on("disconnect", () => {
            var diffTime=Math.abs(timeOnline[socket.id]-new Date())
            var key

            for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
                for(let a=0;a<v.length;++a){// deep copy 
                    if(v[a]===socket.id){
                        key=k;
                        for(let a=0;a<connections[key].length;++a){
                            io.to(connections[key][a]).emit('user-left',socket.id)
                        }
                        var index=connections[key].indexOf(socket.id)
                        connections[key].splice(index,1);
                        if(connections[key].length===0){
                            delete connections[key]
                        }
                    }
                }
            }
        })
    })



    return io;
}   
