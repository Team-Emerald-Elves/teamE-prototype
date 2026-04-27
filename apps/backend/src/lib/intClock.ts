import prisma, { type documentContent } from "@repo/database"

const FULLDAY: number = 8.64e+7

const intClock: Function = async () => {
    const currentDate: number = Date.now()

    const documents: documentContent[] = await prisma.documentContent.findMany({
        where: {
            expiration_date: {
                lt: new Date(currentDate + FULLDAY),
                gt: new Date(currentDate - FULLDAY)
            },
            expiration_warn: false
        }
    })

    if (documents.length < 1) return;

    await prisma.documentContent.updateMany({
        where: {
            id: {
                in: documents.map((doc) => doc.id),
            },
        },
        data: {
            expiration_warn: true,
        },
    })

    documents.map( async (doc: documentContent) => {
        await prisma.notification.createMany({
            data: {
                title: `Document ${doc.name.substring(0, 8) + (doc.name.length > 8 ? '' : '')} is expiring soon!`
            }
        })
    })
}
export default intClock