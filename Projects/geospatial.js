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


async function createGeoSpatialData(){
    await client.indices.create({
        index:'places',
        body:{
            mappings:{
                properties:{
                    name:{type:'text'},
                    location : {type:'geo_point'}
                }
            }
        }
    })
}

async function createIndex(){
    await client.indices.create({
        index:'regions',
        body:{
            mappings:{
                properties:{
                    name:{type:'text'},
                    boundry:{type:'geo_shape'}
                }
            }
        }
    })
}

async function indexDocuments() {
    await client.index({
        index:'places',
        body:{
            name:'Eiffel Tower',
            location: [48.8584,2.2945]
        }
    })

    await client.index({
        index:'places',
        body:{
            name:'Big Ben',
            location: [51.5007,-0.1246]
        }
    })

    await client.index({
        index: 'regions',
        body: {
          name: 'France',
          boundary: { // A geo-shape value as an object with type and coordinates properties
            type: "polygon",
            coordinates: [
              [ [ -5.142222881317139, 48.515277862549805 ], [ -5.142222881317139, 51.0897216796875 ], [ 9.559028625488281, 51.0897216796875 ], [ 9.559028625488281, 41.33361053466797 ], [ -5.142222881317139, 41.33361053466797 ], [ -5.142222881317139, 48.515277862549805 ] ]
            ]
          }
        }
      });


      await client.indices.refresh({
        index:'places'
      })
    
      await client.indices.refresh({
        index:'regions'
      })

}


async function searchWith10KMEiffel(){
    const docs = await client.search({
        index:'places',
        body:{
            query:{
                geo_distance:{
                    distance:'10km',
                    location:[48.8584,2.2945]
                }
            }
        }
    })

    console.log(docs.hits.hits)
}

async function run (){
    // await createGeoSpatialData();
    // await createIndex();
    // await indexDocuments();
    await searchWith10KMEiffel();
}

run().catch(console.error)