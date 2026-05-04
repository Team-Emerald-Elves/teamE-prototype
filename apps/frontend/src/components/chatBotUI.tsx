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
import type {documentContent, Links as linksData} from "@repo/database";
import {getToken} from "@clerk/react";
import qmgr from "@/lib/querymgr.ts";
import * as React from "react";
import FileUpload from "./fileUpload.tsx";

interface Message{
    role: "user" | "model",
    text: string,
}

type editlinksRequest = {
    action: string;
    linkData: Partial<linksData>;
};
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
        Name, fileName,and document type are required, if document type is not specified assume the document type is Reference, the filename is uploaded by the user 
    -editing documents:
        ALWAYS call findDocumentByName first to get the document's real ID before calling editDoc.
        Only change the fields the user specifies, keep all other fields exactly as returned by findDocumentByName.
        Users upload files via a separate UI button.
        NEVER ask the user "What is the filename?" or "Please upload the file." 
        If a user says "Update this document with my new file," assume the file is already handled by the system and call editDoc immediately.
        Leave fileName and filePayload as undefined in your function call unless the user explicitly mentions a NEW filename in their text.
    -Adding links:
        Link Name and url are required
    -editing documents:
        ALWAYS call findLinkByName first to get the link's real ID before calling editLink.
        Only change the fields the user specifies, keep all other fields exactly as returned by findLinkByName.
    
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
                            fileName: {type: "string", description: "The filename of the document this will be uploaded by the user"},
                            document_type:{type: "string", description: "The document type"},
                        },
                        required: ["name", "fileName", "document_type"],
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
                            fileName: {type: "string", description: "INTERNAL USE ONLY. Do not ask user for this. If the user provides a new file, the system will inject this value automatically."},
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
                            id:{type: "string", description: "The UUID of the link (do not ask user for this, use findLinkByName)"},
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
    const filePayload = React.useRef<string | undefined>(undefined);
    const fileName = React.useRef<string | undefined>(undefined);

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve((reader.result as string).split(",")[1]); // strip data URL prefix
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const uploadHandler = (files: File[]) => {
        if (!files || files.length < 1) return;
        toBase64(files[0]).then(
            (data) => {
                filePayload.current = data;
                fileName.current = files[0].name;
            },
            (err) => console.error(err),
        );
    };

    async function createNotifDoc(doc: documentContent, action: string) {
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
            createNotifDoc(newDoc, "created");
        } else {
            createNotifDoc(newDoc, "updated");
        }

        refresh((prev: any) => !prev);

        return newDoc;
    }
    async function createNotifLink(link: linksData, action: string) {
        const token = await getToken();

        qmgr.wait(() => {
            qmgr.getMe(async (res1) => {
                if (!res1.success) {
                    throw new Error("Unable to get me");
                }
                const me = res1.data!;

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
                            targetRoles: [link.owner, "Administrator"],
                            title: `${me.first_name} ${me.last_name} ${action} ${link.link_name.substring(0, 12) + (link.link_name.length >= 12 ? "..." : "")}`,
                        }),
                    },
                );

                if (!res.ok) throw new Error("failed to create link notification");
                console.log(await res.json());
            });
        });
    }

    async function addLinks(body: editlinksRequest, token: string | null) {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update link (status ${res.status}): ${errorText}`);
        }

        const newLink = await res.json();
        createNotifLink(newLink, body.action === "create" ? "created" : "updated");
        return newLink;
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
                return;
            }

            const candidate = response.data.candidates[0].content;
            const part = candidate.parts[0];

            if (!part.functionCall) {
                const botText = part.text || "No response received.";
                setMessages(prev => [...prev, { role: "model", text: botText }]);
                return;
            }

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
                            filePayload: filePayload.current,
                            fileName: fileName.current,
                        }
                    };
                    console.log(newDoc);
                    const addDocument = await createDocument(newDoc as any, token, () => {});
                    fileName.current =undefined;
                    filePayload.current =undefined;
                    functionResult = `Successfully created document: ${addDocument.name}`;

                } else if (name === "editDoc") {
                    console.log(fileName.current);
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
                            filePayload: filePayload.current,
                            fileName: fileName.current,
                        }
                    };
                    const editDocument = await createDocument(newDoc as any, token, () => {});
                    fileName.current =undefined;
                    filePayload.current =undefined;
                    functionResult = `Successfully updated document: ${editDocument.name}`;
                } else if (name === "findDocumentByName") {
                    console.log(fileName.current);
                    try {
                        const token = await getToken();
                        const res = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({}),
                            }
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
                else if (name === "addLink") {
                    const newLink = {
                        action: "create",
                        linkData: {
                            link_name: args.link_name,
                            url: args.url,
                            owner: currentRole,
                        }
                    };
                    console.log(newLink);
                    const addLink = await addLinks(newLink as any, token);
                    functionResult = `Successfully created link: ${addLink.link_name}`;

                } else if (name === "editLink") {
                    const newLink = {
                        action: "edit",
                        linkData: {
                            id: args.id,
                            link_name: args.link_name,
                            url: args.url,
                            owner: currentRole,
                        }
                    };
                    const editLink = await addLinks(newLink as any, token);
                    functionResult = `Successfully updated document: ${editLink.link_name}`;
                } else if (name === "findLinkByName") {
                    try {
                        const token = await getToken();
                        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ action: "list", linkData: {} }),
                        });

                        if (!res.ok) throw new Error("Failed to fetch links");

                        const links = await res.json();
                        const match = links.find((l: any) =>
                            l.link_name.toLowerCase().includes(args.name.toLowerCase())
                        );

                        if (match) {
                            functionResult = JSON.stringify({
                                id: match.id,
                                link_name: match.link_name,
                                url: match.url,
                                role: match.role,
                            });
                        } else {
                            functionResult = JSON.stringify({ error: `No link found matching "${args.name}"` });
                        }
                    } catch (err) {
                        console.error(err);
                        functionResult = JSON.stringify({ error: "Failed to search for link" });
                    }
                }
            } catch(err){
                console.error(err);
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
                    <FileUpload
                        dnd={true}
                        show={true}
                        onUpload={uploadHandler}
                    />
                    <Button variant="ghost" onClick={handleSend} ><Send /></Button>
                </div>

            </PopoverContent>
        </Popover>
    )
}