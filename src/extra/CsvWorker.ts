import * as CSV from 'csv-string';
import { createObjectCsvStringifier } from "csv-writer";

export type File<T extends Record<string, T> = any> = {
    data: Array<T>
    headers: Array<string>;
}

export class CsvWorker {

    /**
     * Creates JSON from CSV file content
     * @param {string} csvBody - CSV file content
     * @return {iCSV.File} - CSV json data
     */
    public static parse(csvBody: string | Buffer): File {
        const friendlyCsvBody = Buffer.isBuffer(csvBody) ? csvBody.toString('utf8') : csvBody;
        const csvData = CSV.parse(friendlyCsvBody.replace(/\\r\\n/g, "\n"), ',');
        const headers: Array<string> = csvData.shift() as Array<string>;

        const rows: Array<any> = [];
        csvData.forEach((data) => {
            if (!(data.length === 1 && data[0] === "")) {

                const row: any = {};
                if (headers.length !== data.length) {
                    throw new Error("Parse Error! Incorrect CSV file format");
                }
                headers.forEach((key, i) => {
                    row[key] = data[i];
                });
                rows.push(row);
            }
        });
        return { headers, data: rows };
    }

    /**
     * Creates CSV file contents from CSV json data
     * @param {iCSV.File} csvData - CSV json data with headers
     * @return {string} - CSV file content as string
     */
    public static stringify(csvData: File): string {
        if (!(Array.isArray(csvData.headers))) {
            throw new Error("Stringify Error! Incorrect incoming headers data");
        }
        if (!(Array.isArray(csvData.data))) {
            throw new Error("Stringify Error! Incorrect incoming body data");
        }
        const header = csvData.headers.map(e => {
            return { id: e, title: e };
        });

        const _csv = createObjectCsvStringifier({ header });
        return _csv.getHeaderString() + _csv.stringifyRecords(csvData.data);
    }

}