class Response {
    constructor(statusCode, httpStatus, message, data){
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;
        this.message = message;
        this.data = data;
    }
}

module.exports =  Response;