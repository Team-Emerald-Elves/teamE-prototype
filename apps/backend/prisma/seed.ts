import { prisma } from '../src/lib/prisma.ts';
//import { type Employee } from '../prisma/generated/client.ts'

const IDS = {
    e1: "00000000-0000-0000-0000-000000000001",
    e2: "00000000-0000-0000-0000-000000000002",
    e3: "00000000-0000-0000-0000-000000000003",
    e4: "00000000-0000-0000-0000-000000000004",
    e5: "00000000-0000-0000-0000-000000000005",
    e6: "00000000-0000-0000-0000-000000000006",
    e7: "00000000-0000-0000-0000-000000000007",
    e8: "00000000-0000-0000-0000-000000000008",
    e9: "00000000-0000-0000-0000-000000000009",

};

async function main() {

    await prisma.employee.createMany({
        skipDuplicates: true,
        data: [
            {clerkUserId: "", id: IDS.e1, uname: "admin",   first_name: "Anastasia",   last_name: "Kelnik",    roles: ["administrator"],       email: "AnastasiaKelnik@gmail.com" },
            {clerkUserId: "", id: IDS.e2, uname: "emp1",    first_name: "Alex",        last_name: "Law",       roles: ["underwriter"],         email: "ALaw@wpi.edu" },
            {clerkUserId: "", id: IDS.e3, uname: "emp2",    first_name: "Janelia",     last_name: "Leo",       roles: ["business analyst"],    email: "JLeo@wpi.edu" },
            {clerkUserId: "", id: IDS.e4, uname: "Akurtiqi",first_name: "Andi",        last_name: "Kurtiqi",   roles: ["admin"],               email: "akurtiqi@wpi.edu" },
            {clerkUserId: "", id: IDS.e5, uname: "Elliot",  first_name: "Elliot",      last_name: "G",         roles: ["admin"],               email: "EG@wpi.edu" },
            {clerkUserId: "", id: IDS.e6, uname: "BPina",   first_name: "Brycen",      last_name: "Pina",      roles: ["underwriter"],         email: "BPina@wpi.edu" },
            {clerkUserId: "", id: IDS.e7, uname: "SJ",      first_name: "Sylvia",      last_name: "J",         roles: ["underwriter"],         email: "SJ@wpi.edu" },
            {clerkUserId: "", id: IDS.e8, uname: "SS",      first_name: "Sylvia",      last_name: "S",         roles: ["business analyst"],    email: "SS@wpi.edu" },
            {clerkUserId: "", id: IDS.e9, uname: "CTeahan", first_name: "Colin",       last_name: "Teahan",    roles: ["business analyst"],    email: "akurtiqi@wpi.edu" }
        ]
    })

    await prisma.fileContent.createMany({
        skipDuplicates: true,
        data: [
            { name: "Underwriter rules",         url: "https://company.com/underwriter-rules", expiration_date: new Date("2030-10-10"), mime_type: "Instructions", document_status: "in_progress", bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663"},
            { name: "Onboarding Guide",          url: "https://company.com/onboarding",         expiration_date: new Date("2027-06-01"), mime_type: "Form",         document_status: "not_started", bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Safety Handbook",           url: "https://company.com/safety",             expiration_date: new Date("2026-01-15"), mime_type: "Document",     document_status: "needs_review",bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663"},
            { name: "Q2 Performance Report",     url: "https://company.com/q2-report",          expiration_date: new Date("2025-09-30"), mime_type: "Report",       document_status: "done",        bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663"},
            { name: "IT Security Policy",        url: "https://company.com/it-security",        expiration_date: new Date("2025-03-01"), mime_type: "Policy",      document_status: "expired",     bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663"},
            { name: "Claims Processing Manual",  url: "https://company.com/claims-manual",     expiration_date: new Date("2031-03-15"), mime_type: "Instructions", document_status: "in_progress",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Employee Handbook",         url: "https://company.com/employee-handbook",  expiration_date: new Date("2028-11-20"), mime_type: "Document",     document_status: "not_started",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Risk Assessment Form",      url: "https://company.com/risk-assessment",    expiration_date: new Date("2029-07-01"), mime_type: "Form",         document_status: "needs_review", bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Compliance Checklist",      url: "https://company.com/compliance",                 expiration_date: new Date("2030-05-30"), mime_type: "Policy",       document_status: "not_started",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Annual Audit Report",       url: "https://company.com/annual-audit",               expiration_date: new Date("2027-12-31"), mime_type: "Report",       document_status: "in_progress",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Data Privacy Guidelines",   url: "https://company.com/data-privacy",               expiration_date: new Date("2032-02-14"), mime_type: "Instructions", document_status: "needs_review", bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Vendor Contract Template",  url: "https://company.com/vendor-contract",            expiration_date: new Date("2028-08-10"), mime_type: "Form",         document_status: "not_started",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Benefits Enrollment Guide", url: "https://company.com/benefits-enrollment",        expiration_date: new Date("2026-09-01"), mime_type: "Document",     document_status: "needs_review", bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "License Renewal Policy",   url: "https://company.com/license-renewal",             expiration_date: new Date("2029-04-22"), mime_type: "Policy",       document_status: "in_progress",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Incident Response Plan",   url: "https://company.com/incident-response",           expiration_date: new Date("2030-08-17"), mime_type: "Instructions", document_status: "not_started",  bucketId: "92ca4260-1bcf-45da-98c1-6c23da390663" },
            { name: "Business Analysis Standards",     url: "https://company.com/ba-standards",        expiration_date: new Date("2030-06-01"), mime_type: "Instructions", document_status: "in_progress",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Requirements Gathering Rules",    url: "https://company.com/requirements-rules",  expiration_date: new Date("2029-11-15"), mime_type: "Instructions", document_status: "needs_review", bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Stakeholder Communication Rules", url: "https://company.com/stakeholder-rules",   expiration_date: new Date("2031-03-20"), mime_type: "Instructions", document_status: "not_started",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Data Governance Rules",           url: "https://company.com/data-governance",     expiration_date: new Date("2030-09-10"), mime_type: "Instructions", document_status: "in_progress",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Process Mapping Guidelines",      url: "https://company.com/process-mapping",     expiration_date: new Date("2028-07-30"), mime_type: "Instructions", document_status: "needs_review", bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Business Case Template",          url: "https://company.com/business-case",       expiration_date: new Date("2029-05-12"), mime_type: "Form",         document_status: "not_started",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Gap Analysis Report",             url: "https://company.com/gap-analysis",        expiration_date: new Date("2027-08-25"), mime_type: "Report",       document_status: "in_progress",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "User Story Handbook",             url: "https://company.com/user-stories",        expiration_date: new Date("2030-01-18"), mime_type: "Document",     document_status: "needs_review", bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Project Scope Document",          url: "https://company.com/project-scope",       expiration_date: new Date("2028-04-05"), mime_type: "Document",     document_status: "not_started",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "KPI Tracking Policy",             url: "https://company.com/kpi-tracking",        expiration_date: new Date("2031-10-22"), mime_type: "Policy",       document_status: "in_progress",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Workflow Intake Form",            url: "https://company.com/workflow-intake",     expiration_date: new Date("2029-02-14"), mime_type: "Form",         document_status: "needs_review", bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Quarterly Business Review",       url: "https://company.com/qbr-report",          expiration_date: new Date("2027-12-01"), mime_type: "Report",       document_status: "not_started",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Change Management Policy",        url: "https://company.com/change-management",   expiration_date: new Date("2030-03-28"), mime_type: "Policy",       document_status: "in_progress",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Vendor Evaluation Form",          url: "https://company.com/vendor-evaluation",   expiration_date: new Date("2028-11-09"), mime_type: "Form",         document_status: "needs_review", bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
            { name: "Process Improvement Report",      url: "https://company.com/process-improvement", expiration_date: new Date("2029-08-16"), mime_type: "Report",       document_status: "not_started",  bucketId: "6fc0fb91-4782-44c6-8ec1-68a31c340f83" },
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