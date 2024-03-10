class ApiResponse {
    constructor(statusCode,data,message="Success"){
        this.statusCode = statusCode
        this.data = data
        this.message=message
        this.success = statusCode < 400;
        //api ke status codes hote hai 
        /*
        
        informational responses (100-199)
        successful responses (200-299)
        Redirectional message (300-399)
        Client error responses(400-499)
        server error responses(500-599)
        
        */ 
    }
}