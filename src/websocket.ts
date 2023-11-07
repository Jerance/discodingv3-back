import { Server } from "socket.io";
import { Server as HttpServer } from 'node:http'

export function initSocketio(httpServer: HttpServer) {
    const io = new Server(httpServer, { cors: {
        origin(_, callback) {
            callback(null, true)
        },
    }})
    
    // lorsqu'un client se connecte, le callback ci-dessous est appeler. 
    // la variable client correspond on client websocket (socket.io) de la personne connectée
    io.on('connection', (client) => {
        
        /**
         * Lorsque le client, sur le front fait: socket.emit('kindof:event', { a: 1, b: 2})
         * Le callback ci-dessous sera appeler, la variable data, contiendra { a: 1, b: 2 }
         */
        client.on('kindof:event', data => {
            console.log('kindof event', data)
            
            /**
             * si vous souhaitez envoyer de la donnée au client, lisez la doc,
             * il sera parfois nécessaire d'envoyer de la donnée a plus d'un client
             * regardez au niveau des broadcast etc..
             * Contrairement a une requete HTTP classique, il est n'est pas obligatoire de répondre
             */
            // il est possible d'envoyer le meme nom d'evenement, c'est le client qui doit l'ecouter cette fois.
            client.emit('kindof:event', { hello: 'world' })
        })
    })
    
    return io
}
