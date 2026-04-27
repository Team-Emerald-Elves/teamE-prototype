import * as Backend from "../../../../packages/database/lib/prismadefs.ts";
import type { UseAuthReturn } from "@clerk/react/types";

const url: string = `${import.meta.env.VITE_BACKEND_URL}`



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
        const rBody = await res.json();
        if (!res.ok || !rBody) {
            let err: string = (rBody).error;
            if (!err) {
                err = "nil";
            }
            throw Error(`Invalid fetch response:\nCode(${res.status}): ${res.statusText},\nError Message: ${err}`);
        }
        return rBody as Object;
    } catch (err) {
        console.error(`Fetcher Error: ${err}`);
        return undefined;
    }
}

async function getRequest(endpoint: string, token: string) {
    try {
        const res = await fetch(`${url}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const body = await res.json()
        if (!res.ok || !body) {
            let err: string = (await res.json()).error;
            if (!err) {
                err = "nil";
            }
            throw Error(`Invalid fetch response:\nCode(${res.status}): ${res.statusText},\nError Message: ${err}`);
        }
        return body as Object;
    } catch (err) {
        console.error(`Fetcher Error: ${err}`);
        return undefined;
    }
}

class ApiRes<T> {
    code: number;
    error: string;
    _data?: T;
    _success: boolean;

    constructor(success: boolean, data?: T) {
        this.code = 200;
        this.error = "placeholder";
        this._data = data
        this._success = success;
    }

    get data() {
        return this._data;
    }

    get success() {
        return this._success;
    }
}

// Class to centralize interaction with the backend
class QueryMgr {
    loggedIn: boolean = false;
    token: string = "";
    waitList: (() => void)[];
    
    constructor() {
        this.waitList = [];
    }

    async getDocuments(callBack: (res: ApiRes<Backend.documentContent[]>, docFilter?: Partial<Backend.documentContent>) => void): Promise<void> {
        const res = await postRequest("/api/supabase/list-documents", this.token, "");
        if (!res) {
            callBack(new ApiRes(false));
            return;
        }
        callBack(new ApiRes(true, res as Backend.documentContent[]))
    
        //console.log("Qmgr docs: ", res);
        
    }
    async auth(authData: UseAuthReturn) {
        authData.getToken().then((tkn) => {
            console.log("QMGR unable to auth.");
            this.token = tkn!;
        })
        this.loggedIn = authData.isSignedIn ? true : false;
        if (this.loggedIn) {
            this.doneWait();
        }
    }
    deauth() {
        this.loggedIn = false;
        this.wait = (then: () => void) => {
            this.waitList.concat(then);
        }
    }
    private async doneWait() {
        this.wait = (then: () => void) => {
            then();
        }
        this.waitList.forEach((cb) => {
            if (this.loggedIn) {
                cb();
            }
        })
        console.log("Qmgr Ready");
    }
    wait = (then: () => void) => {
        this.waitList.concat(then);
    }
}

const qmgr = new QueryMgr();

export default qmgr;