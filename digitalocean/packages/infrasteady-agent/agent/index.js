import got from "got";
//event consists of query params
export async function main(event, context) {
    const { requestTestId, requestEndpoint, requestType, requestHeaders, requestBody, requestQueryParams, requestTimeout } = event;
    const finalRequestEndpoint = getFinalEndPoint(requestEndpoint, requestQueryParams);
    const endpointResponse = await got(finalRequestEndpoint, {
        timeout: { request: requestTimeout || 8000 },
        method: requestType,
        headers: requestHeaders,
    });

    const { timings, statusCode, headers } = endpointResponse;
    const responseData = headers["content-type"] && headers["content-type"].includes("application/json") ? JSON.parse(endpointResponse.body) : endpointResponse.body;

    return { body: { requestTestId: requestTestId, timings: timings, clientResponse: { data: responseData, headers: headers, statusCode: statusCode } } };
}

function getFinalEndPoint(requestEndpoint, requestQueryParams) {
    return `${requestEndpoint}${Object.keys(requestQueryParams || {}).length ? "?" : ""}${Object.keys(requestQueryParams || {})
        .map((key) => `${key}=${requestQueryParams[key]}`)
        .join("&")}`;
}
