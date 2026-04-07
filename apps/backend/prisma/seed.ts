import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL!});
const prisma = new PrismaClient({ adapter});




async function main() {
    await prisma.employee.createMany({
        skipDuplicates: true,
        data: [
            { uname: "akurtiqi",    first_name: "Andi",   last_name: "kurtiqi",   roles: ["administrator"],        email: "akurtiqi@wpi.edu" },
            { uname: "jsmith",     first_name: "Jane",    last_name: "Smith",     roles: ["underwriter"],     email: "jsmith@wpi.edu"     },
            { uname: "mreyes",     first_name: "Miguel",  last_name: "Reyes",     roles: ["underwriter"],               email: "mreyes@wpi.edu"     },
            { uname: "lpatel",     first_name: "Laura",   last_name: "Patel",     roles: ["business analyst"],               email: "lpatel@wpi.edu"     },
            { uname: "tchen",      first_name: "Thomas",  last_name: "Chen",      roles: ["administrator", "business analyst"], email: "tchen@wpi.edu"   },
        ]
    });
    const [e1, e2, e3, e4, e5] =await prisma.employee.findMany({
        orderBy:  {uname: 'asc'}
    });
    await prisma.content.createMany({
        skipDuplicates: true,
        data: [
            { name: "Admin Rules",         URL: "https://company.com/admin-rules",   job_position: "Administrator", expiration_date: new Date("2030-10-10"), content_type: "Instructions", document_status: "in_progress", employeeId: e1!.id },
            { name: "Onboarding Guide",    URL: "https://company.com/onboarding",    job_position: "HR Specialist", expiration_date: new Date("2027-06-01"), content_type: "Form",         document_status: "not_started", employeeId: e2!.id },
            { name: "Safety Handbook",     URL: "https://company.com/safety",        job_position: "Compliance",    expiration_date: new Date("2026-01-15"), content_type: "Document",     document_status: "needs_review", employeeId: e3!.id },
            { name: "Q2 Performance Report", URL: "https://company.com/q2-report",   job_position: "Analyst",       expiration_date: new Date("2025-09-30"), content_type: "Report",       document_status: "done",        employeeId: e4!.id },
            { name: "IT Security Policy",  URL: "https://company.com/it-security",   job_position: "IT Manager",    expiration_date: new Date("2025-03-01"), content_type: "Policy",       document_status: "expired",     employeeId: e5!.id },
        ]
    });
    await prisma.serviceRequests.createMany({
        skipDuplicates: true,
        data: [
            { assigned_id: e1!.id, creator_id: e2!.id, description: "Fix broken login page" },
            { assigned_id: e2!.id, creator_id: e3!.id, description: "Update onboarding documents" },
            { assigned_id: e3!.id, creator_id: e4!.id, description: "Review Q2 performance reports" },
            { assigned_id: e4!.id, creator_id: e5!.id, description: "Renew IT security policy" },
            { assigned_id: e5!.id, creator_id: e1!.id, description: "Audit admin rules compliance" }
        ]
    })


}


main()
    .catch((e) => { console.error(e); process.exit(1);})
    .finally(async() => {await prisma.$disconnect()})