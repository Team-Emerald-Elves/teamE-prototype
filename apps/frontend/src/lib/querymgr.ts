import { useAuth } from "@clerk/react";
import type { ParamKeyValuePair } from "react-router-dom";

const url: string = `${import.meta.env.VITE_BACKEND_URL}`

const { getToken, isSignedIn } = useAuth();

async function postRequest(endpoint: string, token: string, body: string | object) {
    let tBody: string = "";
    if (typeof body !== "string") {
        tBody = JSON.stringify(body);
    } else {
        tBody = body;
    }
    try {
        const res = await fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: tBody
        });
        if (!res.ok) {
            throw Error("invalid fetch response");
        }
        return res.body;
    } catch (err) {
        console.error(`Fetcher Error: ${err}`);
    }
}

async function getRequest(endpoint: string, token: string) {
    try {
        const res = await fetch(`${url}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw Error("invalid fetch response");
        }
        if (!res.body) {
            return null;
        }
        return (await res.body.getReader().read()).value?.toString();
    } catch (err) {
        console.error(`Fetcher Error: ${err}`);
    }
}

// Class to centralize interaction with the backend
class QueryMgr {
    ready: boolean = false;
    token: string = "";

    constructor() {
        getToken().then((tkn) => {
            if (!tkn) {
                throw Error("QueryManager failed to auth");
            }
            this.token = tkn;
            this.ready = true;
        })
    }
}

const qmgr = new QueryMgr;

export default qmgr;