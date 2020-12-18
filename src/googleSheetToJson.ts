// @ts-nocheck

export function googleSheetToJson(
    {
        query,
        useIntegers,
        showRows,
        showColumns,
    }: {
        query: string;
        useIntegers: boolean;
        showRows: boolean;
        showColumns: boolean;
    },
    gsheetData: { feed: { entry: any } }
) {
    const responseObj = {};
    const rows = [];
    const columns = {};
    for (const i = 0; i < gsheetData.feed.entry.length; i++) {
        const entry = gsheetData.feed.entry[i];
        const keys = Object.keys(entry);
        const newRow = {};
        let queried = false;
        for (const j = 0; j < keys.length; j++) {
            const gsxCheck = keys[j].indexOf("gsx$");
            if (gsxCheck > -1) {
                const key = keys[j];
                const name = key.substring(4);
                const content = entry[key];
                let value = content.$t;
                if (value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                    queried = true;
                }
                if (useIntegers === true && !isNaN(value)) {
                    value = Number(value);
                }
                newRow[name] = value;
                if (queried === true) {
                    if (!columns.hasOwnProperty(name)) {
                        columns[name] = [];
                        columns[name].push(value);
                    } else {
                        columns[name].push(value);
                    }
                }
            }
        }
        if (queried === true) {
            rows.push(newRow);
        }
    }
    if (showColumns === true) {
        responseObj["columns"] = columns;
    }
    if (showRows === true) {
        responseObj["rows"] = rows;
    }
    return responseObj;
}
