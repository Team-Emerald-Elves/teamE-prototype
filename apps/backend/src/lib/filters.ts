export const buildWhereClause = (filters: any, additional: any) => {
    const whereClause: any = {AND: [

        ]};
    if (Object.entries(additional).length > 0) {
        whereClause.AND.push(additional);
    }
    if (Object.entries(filters).length > 0) {
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                const tempJSON: any = {OR: []};
                for (const v of Object.entries(value)) {
                    const pushObject: any = {}
                    pushObject[key] = v[1];
                    tempJSON.OR.push(pushObject)
                }
                whereClause.AND.push(tempJSON)
            }
        }
    }

    return whereClause;
};