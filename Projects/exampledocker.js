const { Client } = require('@elastic/elasticsearch');
const { triggerAsyncId } = require('async_hooks');
const fs = require('fs');

const client = new Client({
    node: 'https://localhost:9200',
    auth:{
        username:'elastic',
        password: 'o*kALlyz2NvyYKYu_G3r'
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
        console.error('Connection failed: ', err.message)
    })


const bookMapping = {
    properties:{
        title:{type:'text'},
        author: {type: 'keyword'},
        genre: {type: 'keyword'},
        year: { type: 'integer'}
    }
}

async function createIndex(){
    await client.indices.create({
        index: 'books',
        body:{
            mappings:bookMapping
        }
    })
}

const books = [
    {id: '1', title: 'The catcher in the Rye',author: 'J.D Salinger',genre:'fiction', year: 1951},
    {id:'2', title: 'The Hichhikers guide to the galaxy', author:'Douglas Adams', genre: 'science ficiton',year:'1979'},
    {id:'3',title:'The Art the War', author:'Sun Tzu', genre:'non-fiction',year: -500}
]

async function indexDocuments(){
    try{
        await client.bulk(({
            index: 'books',
            body: books.flatMap(doc => [{index:{_id:doc.id}},doc])
        }))
    }catch(error){
        console.error('Bulk operation error',error)
    }
}

async function refreshIndex(){
    await client.indices.refresh({index:'books'})
}

async function searchDocuments(query){
    const rDocuments = await client.search({
        index:'books',
        body:{
            query:{
                match:{
                    genre:query
                }
            }
        }
    });
    console.log(rDocuments.hits.hits)
}

async function getAllDocuments(){
    const response = await client.search({
        index:'books',
        body:{
            query:{
                match_all:{}
            }
            
        }
    })
    console.log(response.hits.hits)
}


async function getDocumentsWithPaginationAnsSorting(index,page=1, perPage =10,sortField = 'date', sortOrder = 
'asc'){
    const from = (page - 1) * perPage;

    const response = await client.search({

    index:index,
    body:{
        from:from,
        size:perPage,
        sort:[
            {
                [sortField]:{
                    order:sortOrder
                }
            }
        ],
        query:{
            match_all:{}
        }
    }
    })
    console.log(response.hits.hits)
}

async function run(){
    // await createIndex();
    // await indexDocuments();
    // await refreshIndex();
    // await searchDocuments('fiction');
    // await getAllDocuments();
    const indexName = 'books'
    const page = 2
    const perPage = 1
    const sortField = 'author'
    const sortOrder ='asc'
    getDocumentsWithPaginationAnsSorting(indexName,page,perPage,sortField,sortOrder);
}

run().catch(console.error)













































