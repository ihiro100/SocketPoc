function sendResponse(res, statusCode, message, data) {
    let responseToSend = {
        status: statusCode,
        message: message,
        data: data
    }
    res.send(responseToSend)
}

let responseStatus = {
    'success': 200,
    'created': 201,
    'accepted': 202,
    'multipleChoice': 300,
    'movedPermanently': 301,
    'found': 302,
    'badRequest': 400,
    'unAuthorized': 401,
    'paymentRequired': 402,
    'notFound': 404,
    'forbidden': 403,
    'internatServerError': 500,
    'notImplemented': 501,
    'badGateway': 502,
    'serviceUnavailable': 503,
    'gatewayTimeout': 504,
    'httpVersionNotSupported': 505,
    'actionFailed': 424,
    'somethingWentWrong': 425
}

let responseMessage = {
    'success': "Successful",
    'created': "Created",
    'accepted': "Accepted Successfully",
    'multipleChoice': "Multiple Choice",
    'movedPermanently': "Site moved Permanently",
    'found': "Data found",
    'badRequest': "Bad Request",
    'unAuthorized': "Unauthorized",
    'paymentRequired': "Payment Required",
    'notFound': "Not Found",
    'forbidden': "Forbidden",
    'internatServerError': "Internal Server Error",
    'notImplemented': "Not Implemented",
    'badGateway': "Bad Gateway",
    'serviceUnavailable': "Service Unavailable",
    'gatewayTimeout': "Gateway Timeout",
    'httpVersionNotSupported': "HTTP not supported",
    'actionFailed': "Action Failed",
    'somethingWentWrong': "Something Went Wrong"
}

module.exports = {
    responseMessage,
    responseStatus,
    sendResponse
}