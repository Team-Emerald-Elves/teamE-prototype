import { clerkClient, type User } from "@clerk/express";


const ClerkPollRate: number = parseInt(process.env.CLERK_POLL_RATE ?? "1000");

class ECache<T extends object> {
    private _data?: Promise<T>;
    private fetchCb: () => Promise<T>;
    private last: number;

    public constructor(apiCb: () => Promise<T>) {
        this.fetchCb = apiCb;
        this.last = 0;
        this.upate();
    }

    public static fetchApiCb<T>(fetchUrl: string, method: "GET" | "POST") {
        return async (): Promise<T> => {
            const res = await fetch(fetchUrl, {
                method: method,
            })
            if (!res.ok || !res.body) {
                throw new Error(`Error: Unable to fetch cachable data [Code: ${res.status}]: ${res.statusText}\nBody:${res.body}`)
            }
            // @ts-ignore
            return res.body!.json()
        }
    }

    public get data(): Promise<T> {
        if (this._data === undefined) {
            throw new Error("Error: Ecache attempt to retrieve undefined data from ECache")
        }
        return this._data!;

    }

    private set data(nData: Promise<T> | undefined) {
        if (nData === undefined) {
            return;
        }
        this._data = nData;
    }

    private async upate(): Promise<void> {
        const d = Date.now()
        if (d - this.last >= ClerkPollRate) {
            this.last = d;
            this.data = this.fetchCb()
        }
    }
}

class ClerkCache extends ECache<User[]> {
    constructor() {
        super(async (): Promise<User[]> => {
            const ul = await clerkClient.users.getUserList({
                limit: 500
            });
            return ul.data
        })
    }

    public async getUser(uid: string): Promise<User> {
        const ures = await this.data;

        for (const u of ures) {
            if (u.id === uid) {
                return u;
            }
        }
        throw new Error(`Invalid userid in ClerkCache getUser(${uid})`) 
    }
}

export const clerkCache = new ClerkCache();