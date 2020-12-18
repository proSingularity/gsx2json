import { Handler } from "aws-lambda";
import Axios from "axios";
import { googleSheetToJson } from "./googleSheetToJson";
import { IQueryParams } from "./IQueryParams";

export const handler: Handler<{
    queryStringParameters: IQueryParams;
    httpMethod: "GET";
}> = async (event, context, callback) => {
    try {
        const options = getOptions(event.queryStringParameters);
        const spreadsheetData = await fetchSpreadsheetData(options);
        const spreadsheetDataAsJson = googleSheetToJson(
            options,
            spreadsheetData
        );
        return {
            statusCode: "200",
            body: JSON.stringify(spreadsheetDataAsJson),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error({ error });
        console.error(error.message);
        return {
            statusCode: "500",
            body: error.message,
            headers: {
                "Content-Type": "application/json",
            },
        };
    }
};

const fetchSpreadsheetData = async ({
    id,
    sheet,
}: {
    id: string;
    sheet: number;
}) => {
    const url = `https://spreadsheets.google.com/feeds/list/${id}/${sheet}/public/values?alt=json`;
    const res = await Axios.get(url);
    return res.data as { feed: { entry: any } };
};

const getOptions = (
    params: IQueryParams
): {
    id: string;
    sheet: number;
    query: string;
    useIntegers: boolean;
    showRows: boolean;
    showColumns: boolean;
} => {
    const id = params.id;
    const sheet = params.sheet || 1;
    const query = params.q || "";
    const useIntegers = params.integers || true;
    const showRows = params.rows || true;
    const showColumns = params.columns || true;
    return {
        id,
        sheet,
        query,
        useIntegers,
        showRows,
        showColumns,
    };
};
