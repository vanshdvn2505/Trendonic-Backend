export function response_400(res, message){
    return res.status(400).json({
        status:'error',
        message: message,
    })
}

export function response_200(res, message, data) {
    return res.status(200).json({
        status: 'Inserted',
        message,
        data
    });
}


export function response_500(res, log_message, err) {
    var message = err != null ? `${log_message}: ${err}` : log_message;

    console.log(message);

    return res.status(500).json({
        status: 'error',
        error: `Something went wrong.\n${message}`,
        message: "Internal server error"
    });
}
