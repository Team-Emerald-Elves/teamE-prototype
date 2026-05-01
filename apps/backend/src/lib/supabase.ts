import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseURL = process.env.PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SECRET_KEY as string;

// Create a single supabase client for interacting with your database
// server/api route: per request
export async function createSupabaseForRequest() {
    return createClient(supabaseURL, supabaseKey);
}

// To be used when a JWToken is passed by the frontend. (future implementation.)
export async function createSupabaseForRequestJWT(jwt: string) {
    return createClient(supabaseURL, supabaseKey, {
        accessToken: async () => jwt,
    });
}
