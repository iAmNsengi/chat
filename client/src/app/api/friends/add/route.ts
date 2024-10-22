import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth";

export async function POST(req: Request){
    try {
        const body = await req.json()
        const { email } = addFriendValidator.parse(body.email)
        console.log(email);
        
        const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${email}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                },
                cache:"no-store"
            }

        )
        const data = await RESTResponse.json() as { result: string | null }
        const idToAdd = data.result
        const session = await getServerSession(authOptions)
        console.log(session);

        if (!session) return new Response("Unauthorized", { status: 401 })
        if (!idToAdd) return new Response("User with given email doesn't exist", { status: 400 })
        if(idToAdd === session.user.id) return new Response("You can't add yourself as a friend", {status:400})

        return new Response('Request sent', {status: 200})
        
    } catch (error) {
        console.log(error)
    }
}