export const buildWhereClause = (filters: any, additional: any) => {
    const whereClause: any = {AND: [

        ]};
    whereClause.AND.push(additional);

    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            const tempJSON: any = {OR: []};
            for (const v of Object.entries(value)) {
                const pushObject: any = {}
                pushObject[key] = v;
                tempJSON.OR.push(pushObject)
            }
            whereClause.AND.push(tempJSON)
        }
    }

    return whereClause;
};