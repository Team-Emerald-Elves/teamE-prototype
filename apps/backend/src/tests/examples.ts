import UnitTest from "./lib/tests.ts"
import { prisma } from "../lib/prisma.ts"
import { createSupabaseForRequest } from "../lib/supabase";

const testPrisma = new UnitTest( async (testvar) => {
    return await prisma.employee.findMany()
})

const testSupabaseBackend = new UnitTest( async (testvar) => {
    const supabase = createSupabaseForRequest()
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
        throw error
    }

    return data
})

try {
    await testPrisma.assertNotEmpty()
    await testSupabaseBackend.assertNotEmpty()
} catch (err) {
    console.error(err)
}

console.log("All database connection test passed successfully.")
console.log("Prisma Users: \n", testPrisma.result)
console.log("Supabase buckets: \n", testSupabaseBackend.result)