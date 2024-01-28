import got from "got";
//event consists of query params
export async function main(event, context) {
  const {
    requestTestId,
    requestEndpoint,
    requestType,
    requestHeaders,
    requestBody,
    requestQueryParams,
    requestTimeout,
  } = event;
  const endpointResponse = await got(requestEndpoint, {
    timeout: { request: requestTimeout || 8000 },
    method: requestType,
    headers: requestHeaders,
    searchParams: requestQueryParams,
  });

  const { timings, statusCode, headers } = endpointResponse;
  const responseData = endpointResponse.body;

  return {
    body: {
      requestTestId: requestTestId,
      timings: timings,
      clientResponse: {
        data: responseData,
        headers: headers,
        statusCode: statusCode,
      },
    },
  };
}
