export const buildWhereClause = (filters: any, additional: any) => {
    const whereClause: any = {AND: [

        ]};
     if (Object.entries(additional).length > 0) {
        whereClause.AND.push(additional);
    }
        for (const [key, value] of Object.entries(filters)) {
            if (key === "meta_tags") {
                whereClause.AND.push({
                    meta_tags: {
                        hasSome: value
                    }
                });
                continue;
            }
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

    return whereClause;
};

export const buildWhereClausesEmployee = (filters: any, additional: any) => {
    const whereClause: any = {AND: [

        ]};
    if (Object.entries(additional).length > 0) {
        whereClause.AND.push(additional);
    }
    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            if (key == "roles" && filters.roles.length > 0) {
                const tempJSON: any = {roles: {hasSome: []}}
                for (const v of Object.entries(filters)) {
                    for (const c of v[1]) {
                        tempJSON.roles.hasSome.push(c[0])
                    }
                }
                whereClause.AND.push(tempJSON)
            } else {
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