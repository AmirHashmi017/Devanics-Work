// import _ from "lodash";
// import { Row } from "read-excel-file";

// export function validateCSVHeaders(data: Row[], expectedCSVHeaders: string[]) {
//     // get first item of each row as a header
//     const headers = data[0];
//     // Normalize the headers to lowercase
//     const normalizedHeaders = headers.map(header => (header as string).toLowerCase());

//     // lowercase the expected headers
//     expectedCSVHeaders = expectedCSVHeaders.map(header => header.toLowerCase());

//     // Check if the normalized headers match the expected headers
//     return _.isEqual(normalizedHeaders, expectedCSVHeaders)

// }

// export const isEmptyRow = (row: Row) => {
//     return _.every(row, (value) => _.isNil(value) || value === "");
// };