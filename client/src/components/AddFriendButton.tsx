"use client"

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
    
    const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false)
    const [showLoading, setShowLoading] = useState<boolean>(false)
    const {register,  handleSubmit, setError, formState:{errors}} = useForm<FormData>({resolver:zodResolver(addFriendValidator)})

    const addFriend = async (email: string) => {
        try {
            const validatedEmail = addFriendValidator.parse({ email })
            await axios.post('/api/friends/add', {
                email: validatedEmail
            })
            setShowSuccessMsg(true)
        } catch (error) {
            console.error(error)
            toast.error((error as AxiosError)?.message)
            if (error instanceof z.ZodError) return setError('email', { message: error.message })
            if (error instanceof AxiosError) return setError('email', { message: error.response?.data || "Axios error!" })
            setError('email', { message: "Something Went Wrong" })
        } finally {
            setShowLoading(false)
        }
    }

    const onSubmit = (data: FormData) => {
        setShowLoading(true)
        setShowSuccessMsg(false)
        addFriend(data.email)
    }
    
    return <form className="max-w-sm px-4" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Add friend by E-mail</label>
           {errors.email && 
        <p className="mt-2 text-xs border border-red-500 rounded-md px-3  bg-red-100 font-bold  text-red-600">
        {errors.email.message}
        </p>
        }
        {showSuccessMsg &&
        <p className="mt-2 text-xs border border-green-500 rounded-md px-3  bg-green-100 font-bold  text-green-600">
       Friend request sent
        </p>
        }
        <div className="mt-2 flex gap-4">
            <input required {...register('email')} type="text" className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 " placeholder="email@example.com"/>
            
        <Button type="submit" className="px-5" isLoading={showLoading}>Add</Button>
        </div>
    </form>
};

export default AddFriendButton;
