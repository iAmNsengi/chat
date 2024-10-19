"use client"

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CrossIcon, UtensilsCrossed, X } from "lucide-react";


interface AddFriendButtonProps {
    
}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
    
    const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false)
    const {register,  handleSubmit, setError, formState:{errors}} = useForm<FormData>({resolver:zodResolver(addFriendValidator)})


    const addFriend = async (email: string) => {
        try {
            const validatedEmail = addFriendValidator.parse({ email })
            
            await axios.post('/api/friends', {
                email:validatedEmail
            })

            setShowSuccessMsg(true)
        } catch (error) {
            console.error(error)            
            if (error instanceof z.ZodError) {
                setError('email', {message:error.message})
                return
            }
            if (error instanceof AxiosError) {
                setError('email', { message: error.response?.data })
                return
            }
            setError('email', {message: "Something Went Wrong"})
            
        }
    }

    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }
    
    return <form className="max-w-sm px-4" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Add friend by E-mail</label>
        <div className="mt-2 flex gap-4">
            <input {...register('email')} type="text" className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 " placeholder="email@example.com"/>
            
        <Button className="px-5">Add</Button>
        </div>
            {errors.email && 
        <p className="mt-2 text-xs border border-red-500 rounded-md px-3  bg-red-100 font-bold  text-red-600">
            <span className="">
        {errors.email.message}
            </span>
        </p>
            }
    </form>
};

export default AddFriendButton;