import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import type { ReactElement } from "react";
import { useChat } from "@ai-sdk/react";
import { useNavigate } from "react-router";
import * as z from "zod";
import qmgr from "@/lib/querymgr.ts";
import type { Document } from "../../../../packages/database/lib/prismadefs.ts";

async function getFirstDoc(
    docFilter: Partial<Document>,
): Promise<Document | undefined> {
    qmgr.wait(() => {
        qmgr.getDocuments((res) => {
            if (!res.success) {
                return undefined;
            }
            const dat: Document[] = res.data!.filter(
                (doc: Document): boolean => {
                    i;
                },
            );
            if (dat.length > 0) {
                return dat[0];
            }
            return undefined;
        });
    });
    return undefined;
}

function EBot(): ReactElement {
    const nav = useNavigate();

    tool({
        description: "Open a document",
        inputSchema: z.object({
            docName: z.string().describe("The name of the document to open"),
            docId: z.uuid().describe("The uuid of the document to open"),
        }),
        execute: async ({ docName, docId }) => {
            if (docId) {
                getFirstDoc();
            }
        },
    });

    return (
        <>
            <div>BOT</div>
        </>
    );
}

export default EBot;
