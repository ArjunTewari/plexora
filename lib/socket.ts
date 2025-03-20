import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      socket.on("join-restaurant", (restaurantId) => {
        socket.join(`restaurant-${restaurantId}`)
        console.log(`Socket ${socket.id} joined restaurant-${restaurantId}`)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return res.socket.server.io
}

