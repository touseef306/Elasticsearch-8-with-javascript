const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

const client = new Client({
    node: 'https://localhost:9200',
    auth:{
        username:'elastic',
        password: 'KBUobfxwcPu+y7Z*ooDm'
    },
    tls:{
        ca: fs.readFileSync("D:/Spring Boot Elasticsearch 8 Course/elasticsearch-8.7.0-windows-x86_64/elasticsearch-8.7.0/config/certs/http_ca.crt"),
        secureProtocol: 'TLSv1_2_method'
    }
});

client.ping()
    .then(() =>{
        console.log('Connection successful.');
    })
    .catch((err)=>{
        console.error('Connection failed: ', err.message)
    })


    async function createIndex(){
        await client.indices.create({
            index:'blog',
            body:{
                settings:{
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                mappings:{
                    properties:{
                        title:{type:'text'},
                        content: {type:'text'},
                        date:{type:'date'}
                    }
                }
            }
        });
    }

    const documents =[
        {
            id: '1',
            title: 'Hello world',
            content: 'this is my first blog post',
            date: '2023-10-10'
        },
        {
            id: '2',
            title: 'Elasticsearch basics',
            content: 'this is my second blog post',
            date: '2023-10-11'
        }
    ];

async function indexDocuments(){
    await client.bulk({
        index: 'blog',
        body: documents.flatMap(doc => [{index: {_id:doc.id}},doc])
    });
}

async function refreshIndex(){
    await client.indices.refresh({index:'blog'});
}

//Get a document by id
async function getDocumentById(id){
    const body = await client.get({
        index:'blog',
        id:id
    });
    console.log(body)
}


async function searchDocuments(query){
    const body = await client.search({
        index:'blog',
        body:{
            query:{
                match:{
                    content:query
                }
            }
        }
    });
    console.log(body.hits.hits);
}


async function run(){
    // await createIndex();
    // await indexDocuments();
    // await refreshIndex();
    // await getDocumentById('1');
    await searchDocuments('blog');
}

run().catch(console.error)












