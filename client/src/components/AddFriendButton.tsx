"use client"

import { FC } from "react";
import Button from "./ui/Button";

interface AddFriendButtonProps {
    
}

const AddFriendButton:FC<AddFriendButtonProps> = ({}) => {
    
    return <form className="max-w-sm px-4">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Add friend by E-mail</label>
        <div className="mt-2 flex gap-4">
            <input type="text" className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 " placeholder="email@example.com"/>
            
        <Button className="px-5">Add</Button>
        </div>
    </form>
};

export default AddFriendButton;