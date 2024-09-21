
const FormatDay = (date,config) => {
    const defaultOptions ={ day: "numeric",month:"2-digit",year:"numeric"}
    const options = config ? config:defaultOptions;
    return new Date(date).toLocaleDateString('vi-VN',options)
}

export default FormatDay;
