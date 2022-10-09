exports.handler = async (event) => {
    let keyword = event.queryStringParameters.keyword;
    let greeting = 'Sharath Banoth says '+ keyword;
    console.log(greeting)
    return {"body": greeting}
};
