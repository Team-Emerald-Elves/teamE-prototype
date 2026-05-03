import { Button } from "./ui/button.tsx";
import { MessageCircle, Send  } from 'lucide-react';
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useState} from "react";
import axios from "axios";

interface Message{
    role: "user" | "model",
    text: string,
}
console.log("Vite Key Check:", import.meta.env.VITE_GEMINI_API_KEY);
export default function ChatBot(){
    const[messages, setMessages] =useState<Message[]>([]);
    const[input, setInput] = useState("");
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [isLoading, setIsLoading] = useState(false);
    const handleSend = async() => {
        if (!input.trim() || isLoading) return;

        const userInput: Message = {role: "user", text: input};
        const newHistory = [...messages, userInput];
        setMessages(newHistory);
        setIsLoading(true);
        setInput("");

        await generateResponse(newHistory);
    };
    const navInstructions = `
    You are an assistant for a content management system (CMS). Your role is to help users navigate and understand the software.
    
    Pages and Features:
    
    - Home Page:
      Displays a dashboard that includes:
      - Favorited links and documents
      - Statistics (e.g., document view counts)
      - Employee information
      - User activity
      - A weekly calendar of the user’s activities
    
    - Documents Page:
      Contains all company documents. Each document includes:
      - Favorite status
      - Title
      - Creation date
      - Expiration date
      - Content owner
      - Last modified date
      - (If permitted by user role) the ability to check out a document
      Users can filter documents by all available fields.
    
    - Links Page:
      Contains all saved company links. Each link includes:
      - Favorite status
      - Title
      - URL
      - Associated user role
      - Creation date
      - Last modified date
    
    - Calendar Page:
      Displays the user’s monthly calendar.
    
    - User Management Page:
      Accessible only to admin users. Displays all employees in the company.
    
    Guidelines:
    - Provide clear navigation guidance based on user requests.
    - Reference specific pages and features when helping users.
    - Be concise and helpful.
    `;

    const generateResponse = async (history: Message[]) => {
            try{
                const formattedContents = history.map(msg => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.text }]
                }));
                console.log("Sending to Gemini:", JSON.stringify({ contents: formattedContents }, null, 2));
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
                const response = await axios.post(
                    url,
                    {
                        systemInstruction:{
                            parts:[{text: navInstructions}]
                        },
                        contents: formattedContents
                    },
                    { headers: { "Content-Type": "application/json" } }
                );

                const botText = response.data.candidates[0]?.content?.parts[0]?.text || "No response received.";

                setMessages((prev) => [...prev, { role: "model", text: botText }]);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
    }
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
                        <div key={index} className={`p-2 rounded-md text-sm w-fit max-w-[85%] ${
                            message.role === "user"
                                ? "bg-[#5f935a] text-white ml-auto"
                                : "bg-gray-200 text-gray-800 mr-auto"
                        }`} >
                            {message.text}</div>
                    ))}
                {isLoading && <div className="text-xs text-gray-400 animate-pulse">Thinking...</div>}
                </div>
                <div className="flex w-full items-center gap-2 border-t p-2">
                    <Input id="chatBar" value={input} onKeyDown={(e) => e.key === 'Enter' && handleSend()} onChange={(e) => setInput(e.target.value)} placeholder="Enter chat" />
                    <Button variant="ghost" onClick={handleSend} ><Send /></Button>
                </div>

            </PopoverContent>
        </Popover>
    )
}