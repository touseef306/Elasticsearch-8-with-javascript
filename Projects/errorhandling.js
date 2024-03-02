const { Client,errors } = require('@elastic/elasticsearch');
const fs = require('fs');

const client = new Client({
    node: 'https://localhost:9200',
    auth:{
        username:'elastic',
        password: '*NsOz1wOidJ4-gTQdJE6'
    },
    tls:{
        ca: fs.readFileSync("D:/certs/http_ca.crt"),
        secureProtocol: 'TLSv1_2_method'
    }
});

//Request Errors

async function handleRequestError(){
    try{

        await client.search({
            index:"wrong_index",
            body:{
                query:{
                    match_all:{}
                }
            }
        })
    }catch(error){

        console.error(`Request Error: ${error.meta.statusCode} - ${error.message}`)
    }
}

// handleRequestError();

//Connection Error

async function handleConnectionError(){
    try{

        await client.ping();
        console.log("successfully connected")
    }catch(error){
console.error(`Connection Error: ${error.message}`)
    }
}

handleConnectionError();

//RESPONSE ERROR

async function handleResponseError(){
    try{

        const body =await client.index({
            index:"my-index",
            body:{
                    age:'helloworld'
            }
        });
        console.log(body)
    }catch(error){
        console.error(`Response Error: ${error.meta.statusCode} - ${error.message}`)


    }
}

// handleResponseError();

function logError(error){
    console.error(error.name)
    console.error(error.message)
    // console.error(error.meta)
}


async function indexDoc(){
    try{
        await client.index({
            index:"test",
            body:{
                name:"Alice",
                age:25
            }
        })
    }catch(error){
        if(error  instanceof errors.ResponseError){
            logError(error)
        }else{
            logError(error)
        }
    }
}

async function searchDoc(){
    try{
        await client.search({
            index:"test",
            body:{
                query:{
                    match:"invalid" //this is not a valid query
                }
            }
        },{
            requestTimeout: 1000
        }
    )
    }catch(error){
        if(error instanceof errors.TimeoutError){
            logError(error)
        }else if (error instanceof errors.ResponseError){
            logError(error)
        }else{
            throw error
        }
    }
}

indexDoc()
searchDoc()