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
import ReactMarkdown from "react-markdown";
import type {IFile} from "@/components/submitPopupConfirmation.tsx";
import type {documentContent} from "@repo/database";
import {getToken} from "@clerk/react";
import qmgr from "@/lib/querymgr.ts";
import * as React from "react";
import DateAndTime from "./date.tsx";

interface Message{
    role: "user" | "model",
    text: string,
}
type SubmitConfirmationPopupProps = {
    type: string;
    formData: {
        id: number;
        name: string;
        url: string;
        contentOwner: string;
        role: string;
        document_type: string;
        expirationDate?: Date;
        expirationTime: string;
        document_status: string;
        filePayload?: string;
        fileName?: string;
    };
    refresh: (any: any) => void;
    open: (arg: boolean) => void;
    disabled: boolean;
};

console.log("Vite Key Check:", import.meta.env.VITE_GEMINI_API_KEY);
export default function ChatBot(){
    const[messages, setMessages] =useState<Message[]>([]);
    const[input, setInput] = useState("");
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = React.useState<string[]>([]);
    const [empID, setEmpID] = React.useState("");
    const navInstructions = `
    You are an assistant for a content management system (CMS). Your role is to help users navigate and understand the software.
    
    Pages and Features:
    
    - Home Page:
      Displays a customizable dashboard that includes:
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
    
    -Adding documents:
        Name, url,and document type are required, if document type is not specified assume the document type is Reference
    -editing documents:
        ALWAYS call findDocumentByName first to get the document's real ID before calling editDoc.
        Only change the fields the user specifies, keep all other fields exactly as returned by findDocumentByName.
    
    Guidelines:
    - Provide clear navigation guidance based on user requests.
    - Reference specific pages and features when helping users.
    - Be concise and helpful.
    `;
    const operations = [
        {
            functionDeclarations:[
                {
                    name: "addDoc",
                    description: "adds a document to the database",
                    parameters:{
                        type: "object",
                        properties:{
                            name: {type: "string", description: "The name/title of the document"},
                            url: {type: "string", description: "The url of the document"},
                            document_type:{type: "string", description: "The document type"},
                        },
                        required: ["name", "url", "document_type"],
                    }
                },
                {
                    name: "editDoc",
                    description: "edit a document",
                    parameters:{
                        type:"object",
                        properties:{
                            id:{type: "number", description: "The internal ID (do not ask user for this, use findDocumentByName)"},
                            name: {type: "string", description: "The name/title of the document"},
                            url: {type: "string", description: "The url of the document"},
                            document_type:{type: "string", description: "The document type"},
                            expirationDate: {type: "string", description: "The expiration date"},
                            document_status:{type: "string", description: "The document status"},
                            favorite: {type: "boolean", description: "If a document is favorite or not if it is favorited it is true if it is not it is false"},
                        },
                        required: ["name"],
                    }
                },
                {
                    name: "findDocumentByName",
                    description: "Finds a document by name and returns its ID and full details. ALWAYS call this before editDoc to get the document's real ID.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "The name/title of the document to search for" }
                        },
                        required: ["name"]
                    }
                },
                {
                    name: "addLink",
                    description: "adds a link to the database",
                    parameters:{
                        type: "object",
                        properties:{
                            link_name: {type: "string", description: "The name/title of the link"},
                            url: {type: "string", description: "The url of the link"},
                        },
                        required: ["link_name", "url"],
                    }
                },
                {
                    name: "editLink",
                    description: "edit a link",
                    parameters:{
                        type:"object",
                        properties:{
                            id:{type: "number", description: "The internal ID (do not ask user for this, use findDocumentByName)"},
                            link_name: {type: "string", description: "The name/title of the document"},
                            url: {type: "string", description: "The url of the document"},
                        },
                        required: ["link_name", "url"],
                    }
                },
                {
                    name: "findLinkByName",
                    description: "Finds a link by name and returns its ID and full details. ALWAYS call this before editLink to get the document's real ID.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "The name/title of the link to search for" }
                        },
                        required: ["name"]
                    }
                },
            ]
        }
    ]
    async function createNotif(doc: documentContent, action: string) {
        const token = await getToken();

        qmgr.wait(() => {
            qmgr.getMe(async (res1) => {
                if (!res1.success) {
                    throw new Error("Unable to get me");
                }
                const me = res1.data!;
                console.log(me);

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            public: true,
                            targetRoles: [doc.assigned_role, "Administrator"],
                            title: `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(0, 12) + (doc.name.length >= 12 ? "..." : "")}`,
                        }),
                    },
                );

                if (!res.ok) {
                    throw new Error("failed to create view notification");
                }
                console.log(await res.json());
            });
        });
    }

    async function loadUser() {
        const token = await getToken();

        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/tests/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!res.ok) {
            throw new Error("Failed to get current user");
        }

        const data = await res.json();

        setEmpID(data.id);
        setRoles(
            (data.roles as string[]).map((role) => role.toLowerCase()),
        );
    }
    const ROLE_LABELS: Record<string, string> = {
        administrator: "Administrator",
        businessanalyst: "BusinessAnalyst",
        underwriter: "UnderWriter",
        businessoperator: "BusinessOperator",
        exceloperator: "ExcelOperator",
        actuarialanalyst: "ActuarialAnalyst",
    };
    const currentRole = ROLE_LABELS[roles.at(0) as string];

    React.useEffect(() => {
        loadUser();
    }, []);

    function buildExpirationDate(
        expirationDate?: Date,
        expirationTime?: string,
    ): string | undefined {
        if (!expirationDate) return undefined;

        const date = new Date(expirationDate);

        if (expirationTime) {
            const [hours = "0", minutes = "0", seconds = "0"] =
                expirationTime.split(":");
            date.setHours(Number(hours), Number(minutes), Number(seconds), 0);
        }

        return date.toISOString();
    }
    async function createDocument(
        fileData: SubmitConfirmationPopupProps,
        token: string,
        refresh: (any: any) => void,
    ) {
        const data: IFile = {
            id: fileData.formData.id,
            name: fileData.formData.name,
            url: fileData.formData.url || "Local upload",
            content_owner: fileData.formData.contentOwner,
            expiration_date: buildExpirationDate(
                fileData.formData.expirationDate,
                fileData.formData.expirationTime,
            ),
            document_type: fileData.formData.document_type,
            document_status: fileData.formData.document_status,
            assigned_role: fileData.formData.role,
            filePayload: fileData.formData.filePayload,
            fileName: fileData.formData.fileName,
        };
        console.log(data.assigned_role);

        const endpoint =
            fileData.type === "Create"
                ? "/api/supabase/create-document"
                : "/api/supabase/update-document";

        const method = fileData.type === "Create" ? "POST" : "PUT";
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
            {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(errorText);
            throw new Error(errorText || "Network response was not ok");
        }

        const newDoc = await response.json();
        console.log(newDoc);

        if (fileData.type === "Create") {
            createNotif(newDoc, "created");
        } else {
            createNotif(newDoc, "updated");
        }

        refresh((prev: any) => !prev);

        return newDoc;
    }

    const isProcessing = React.useRef(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading || isProcessing.current) return;

        const userInput: Message = { role: "user", text: input };
        const newHistory = [...messages, userInput];
        setMessages(newHistory);
        setIsLoading(true);
        setInput("");
        isProcessing.current = true;

        try {
            await generateResponse(newHistory);
        } finally {
            setIsLoading(false);
            isProcessing.current = false;
        }
    };

    const generateResponse = async (initialHistory: any[]) => {
        let history = initialHistory;

        // Loop instead of recurse — avoids multiple finally blocks firing
        while (true) {
            const formattedContents = history.map(msg => {
                if (msg.parts) {
                    return { role: msg.role, parts: msg.parts };
                }
                return {
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.text }]
                };
            });

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

            let response;
            try {
                response = await axios.post(url, {
                    systemInstruction: { parts: [{ text: navInstructions }] },
                    contents: formattedContents,
                    tools: operations,
                }, { headers: { "Content-Type": "application/json" } });
            } catch (error: any) {
                if (error?.response?.status === 429) {
                    setMessages(prev => [...prev, { role: "model", text: "⚠️ Too many requests. Please wait a moment and try again." }]);
                } else {
                    setMessages(prev => [...prev, { role: "model", text: "Something went wrong. Please try again." }]);
                }
                console.error(error);
                return; // exit the loop
            }

            const candidate = response.data.candidates[0].content;
            const part = candidate.parts[0];

            if (!part.functionCall) {
                // No function call — just a text reply, we're done
                const botText = part.text || "No response received.";
                setMessages(prev => [...prev, { role: "model", text: botText }]);
                return;
            }

            // Handle function call
            const { name, args } = part.functionCall;
            let functionResult = "";

            try {
                const token = await getToken();

                if (name === "addDoc") {
                    const newDoc = {
                        type: "Create",
                        formData: {
                            id: Math.trunc((Math.random() * 10000) % 10000),
                            name: args.name,
                            url: args.url,
                            contentOwner: empID,
                            role: currentRole,
                            expirationDate: undefined,
                            document_status: "not_started",
                            document_type: args.document_type,
                        }
                    };
                    console.log(newDoc);
                    const addDocument = await createDocument(newDoc as any, token, () => {});
                    functionResult = `Successfully created document: ${addDocument.name}`;

                } else if (name === "editDoc") {
                    const newDoc = {
                        type: "Update",
                        formData: {
                            id: Number(args.id) || 0,
                            name: args.name,
                            url: args.url,
                            contentOwner: empID,
                            role: currentRole,
                            expirationDate: args.expirationDate,
                            document_status: args.document_status,
                            document_type: args.document_type || "Reference",
                            favorite: args.favorite,
                        }
                    };
                    const editDocument = await createDocument(newDoc as any, token, () => {});
                    functionResult = `Successfully updated document: ${editDocument.name}`;
                } else if (name === "findDocumentByName") {
                    try {
                        const token = await getToken();
                        const res = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/api/supabase/get-documents`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (!res.ok) throw new Error("Failed to fetch documents");

                        const docs = await res.json();
                        const match = docs.find((d: any) =>
                            d.name.toLowerCase().includes(args.name.toLowerCase())
                        );

                        if (match) {
                            // Return the full document so Gemini can preserve unchanged fields in editDoc
                            functionResult = JSON.stringify({
                                id: match.id,
                                name: match.name,
                                url: match.url,
                                document_type: match.document_type,
                                document_status: match.document_status,
                                assigned_role: match.assigned_role,
                                expiration_date: match.expiration_date,
                            });
                        } else {
                            functionResult = JSON.stringify({ error: `No document found matching "${args.name}"` });
                        }
                    } catch (err) {
                        console.error(err);
                        functionResult = JSON.stringify({ error: "Failed to search for document" });
                    }
                }
            } catch (err) {
                console.error(err);
                functionResult = `Error executing ${name}`;
            }

            // Update history and loop back for Gemini's natural language reply
            // 500ms delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 500));

            history = [
                ...history,
                { role: "model", parts: candidate.parts },
                {
                    role: "user",
                    parts: [{
                        functionResponse: {
                            name,
                            response: { content: functionResult }
                        }
                    }]
                }
            ];
            // Loop continues — next iteration sends updated history
        }
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
                        <div key={index} className={`p-2 rounded-md text-sm w-fit max-w-[85%] ${
                            message.role === "user"
                                ? "bg-[#5f935a] text-white ml-auto"
                                : "bg-gray-200 text-gray-800 mr-auto"
                        }`} >
                            <ReactMarkdown>
                                {message.text}
                            </ReactMarkdown>
                        </div>
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