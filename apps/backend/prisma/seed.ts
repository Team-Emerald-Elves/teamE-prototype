import { prisma } from '../src/lib/prisma.ts';
import { type Employee } from '../prisma/generated/client.ts'

const IDS = {
    e1: "00000000-0000-0000-0000-000000000001",
    e2: "00000000-0000-0000-0000-000000000002",
    e3: "00000000-0000-0000-0000-000000000003",
    e4: "00000000-0000-0000-0000-000000000004",
    e5: "00000000-0000-0000-0000-000000000005",
};

async function main() {

    await prisma.employee.createMany({
        skipDuplicates: true,
        data: [
            {clerkUserId: "", id: IDS.e1, uname: "akurtiqi",    first_name: "Andi",   last_name: "Kurtiqi",   roles: ["administrator"],             email: "akurtiqi@wpi.edu" },
            {clerkUserId: "", id: IDS.e2, uname: "jsmith",     first_name: "Jane",    last_name: "Smith",     roles: ["underwriter"],               email: "jsmith@wpi.edu" },
            {clerkUserId: "", id: IDS.e3, uname: "mreyes",     first_name: "Miguel",  last_name: "Reyes",     roles: ["underwriter"],               email: "mreyes@wpi.edu" },
            {clerkUserId: "", id: IDS.e4, uname: "lpatel",     first_name: "Laura",   last_name: "Patel",     roles: ["business analyst"],               email: "lpatel@wpi.edu" },
            {clerkUserId: "", id: IDS.e5, uname: "tchen",      first_name: "Thomas",  last_name: "Chen",      roles: ["administrator", "business analyst"], email: "tchen@wpi.edu" },
        ]
    })

    await prisma.fileContent.createMany({
        skipDuplicates: true,
        data: [
            { name: "Admin Rules",         url: "https://company.com/admin-rules", expiration_date: new Date("2030-10-10"), mime_type: "Instructions", document_status: "in_progress", bucketId: crypto.randomUUID()},
            { name: "Onboarding Guide",    url: "https://company.com/onboarding",  expiration_date: new Date("2027-06-01"), mime_type: "Form",         document_status: "not_started", bucketId: crypto.randomUUID()},
            { name: "Safety Handbook",     url: "https://company.com/safety", expiration_date: new Date("2026-01-15"), mime_type: "Document",     document_status: "needs_review", bucketId: crypto.randomUUID()},
            { name: "Q2 Performance Report", url: "https://company.com/q2-report", expiration_date: new Date("2025-09-30"), mime_type: "Report",       document_status: "done",        bucketId: crypto.randomUUID()},
            { name: "IT Security Policy",  url: "https://company.com/it-security", expiration_date: new Date("2025-03-01"), mime_type: "Policy",       document_status: "expired",     bucketId: crypto.randomUUID()},
        ]
    });
    await prisma.serviceRequests.createMany({
        skipDuplicates: true,
        data: [
            { assigned_id: IDS.e1, creator_id: IDS.e2, description: "Fix broken login page" },
            { assigned_id: IDS.e2, creator_id: IDS.e3, description: "Update onboarding documents" },
            { assigned_id: IDS.e3, creator_id: IDS.e4, description: "Review Q2 performance reports" },
            { assigned_id: IDS.e4, creator_id: IDS.e5, description: "Renew IT security policy" },
            { assigned_id: IDS.e5, creator_id: IDS.e1, description: "Audit admin rules compliance" }
        ]
    });
}


main()
    .catch((e) => { console.error(e); process.exit(1);})
    .finally(async() => {await prisma.$disconnect()})