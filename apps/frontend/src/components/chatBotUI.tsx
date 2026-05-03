import { Button } from "./ui/button.tsx";
import { MessageCircle, Send  } from 'lucide-react';
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useState} from "react";
export default function ChatBot(){
    const[messages, setMessages] =useState([]);
    const[input, setInput] = useState("");
    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, input]);
        setInput("");
    };
    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button className="fixed bottom-6 right-6 w-12 h-12 rounded-full p-0 flex bg-[#5f935a] text-color-white items-center justify-center shadow-lg">
                    <MessageCircle /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 h-96 p-0 flex flex-col">
                <div className="flex-1 overflow-y-auto p-3">
                    <p className="text-sm text-gray-500">Start chatting...</p>
                </div>
                <div className="flex flex-col overflow-y-auto p-3 space-y-2 items-end">
                    {messages.map((message,index) => (
                        <div key={index} className="p-2 rounded-md bg-gray-100 text-sm w-fit max-w-[80%]" >
                            {message}</div>
                    ))}
                </div>
                <div className="flex w-full items-center gap-2 border-t p-2">
                    <Input id="chatBar" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter chat" />
                    <Button variant="ghost" onClick={handleSend}><Send /></Button>
                </div>

            </PopoverContent>
        </Popover>
    )
}