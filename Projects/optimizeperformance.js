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

// use track_total_hits
const body = await client.search({
    index:"exampleindex",
    body:{
        query:{
            match_all:{}
        }
    },
    track_total_hits:false
})

// source filtering

const body1 = await client.search({
    index:"exampleindex",
    body:{
        query:{
            match_all:{}
        }
    },
    _source:['field1','filed2','field3']
})
// use pagination wisely

const body2 = await client.search({
    index:"exampleindex",
    body:{
        query:{
            match_all:{}
        }
    },
    scroll:'1m'
})

let scroll_id = body2._scroll_id

while (true){
    const resp = await client.scroll(
        {
            scroll_id:scroll_id,
            scroll:'1m'
        }
    );

    if(body.hits.hits.length === 0){
        break;
    }

    scroll_id = resp._scroll_id
}