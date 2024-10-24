import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request){
    try {
        const body = await req.json()
        const { email: emailToAdd } = addFriendValidator.parse(body.email)
        
        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`)        
        const session = await getServerSession(authOptions)
        
        if (!session) return new Response("Unauthorized", { status: 401 })
        if (!idToAdd) return new Response("User with given email doesn't exist", { status: 400 })
        if(idToAdd === session.user.id) return new Response("You can't add yourself as a friend", {status:400})

        // check if user is already added
        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1
        
        if (isAlreadyAdded) return new Response("Already added user", {status: 400})

        // already friends
        const isAlreadyFriends = await fetchRedis('sismember', `user:${idToAdd}:friends`, session.user.id) as 0 | 1
        if (isAlreadyFriends) return new Response("Can't add your friend again!", { status: 400 })
        
        // valid request
        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)
        return new Response("Adding friends done successfully!")

        
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid request", {status:422})
        }
        return new Response("Invalid request", {status:400})
    }
}