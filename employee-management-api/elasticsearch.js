const { Client } = require('@elastic/elasticsearch');
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

client.ping()
    .then(() =>{
        console.log('Connection successful.');
    })
    .catch((err)=>{
        console.error('Connection failed: ', err)
    })

module.exports = client;