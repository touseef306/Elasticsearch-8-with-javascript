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


async function indexDocuments(){
    const sampleData =[
        {
            name: 'Product A',
            category: 'Electronics',
            timestamp: '2023-01-01T10:00:00Z',
            price: 99.99,
            rating: 4.5,
          },
          {
            name: 'Product B',
            category: 'Electronics',
            timestamp: '2023-01-02T12:00:00Z',
            price: 149.99,
            rating: 4.2,
          },
          {
            name: 'Product C',
            category: 'Clothing',
            timestamp: '2023-01-03T14:00:00Z',
            price: 29.99,
            rating: 4.8,
          },
          {
            name: 'Product D',
            category: 'Clothing',
            timestamp: '2023-01-04T09:30:00Z',
            price: 39.99,
            rating: 4.6,
          },
          {
            name: 'Product E',
            category: 'Furniture',
            timestamp: '2023-01-05T16:45:00Z',
            price: 499.99,
            rating: 4.2,
          },
          {
            name: 'Product F',
            category: 'Furniture',
            timestamp: '2023-01-06T11:15:00Z',
            price: 799.99,
            rating: 4.7,
          },
          {
            name: 'Product G',
            category: 'Electronics',
            timestamp: '2023-01-07T09:20:00Z',
            price: 79.99,
            rating: 4.4,
          },
          {
            name: 'Product H',
            category: 'Clothing',
            timestamp: '2023-01-08T15:30:00Z',
            price: 59.99,
            rating: 4.9,
          },
          {
            name: 'Product I',
            category: 'Furniture',
            timestamp: '2023-01-09T13:00:00Z',
            price: 199.99,
            rating: 4.3,
          },
          {
            name: 'Product J',
            category: 'Clothing',
            timestamp: '2023-01-10T14:30:00Z',
            price: 19.99,
            rating: 4.2,
          },
    ]

    for(let i=0; i<sampleData.length; i++){
        await client.index({
            index:'products0002',
            body:sampleData[i]
        });
    }
console.log('Sample documents indexed.')
}

// indexDocuments();


async function performTermsAggregation(){
    const body = await client.search({
        index:'products0002',
        body:{
            size:0,
            aggs:{
                category_terms:{
                    terms:{
                        field:'category.keyword'
                    }
                }
            }
        }
    })

    console.log("Terms Aggregation results:",body.aggregations.category_terms)
}

// performTermsAggregation();

async function perfromDateHistogramAggregation(){
    const body = await client.search({
        index:'products0002',
        body:{
            size:0,
            aggs:{
                date_histogram:{
                    date_histogram:{
                        field:'timestamp',
                        calendar_interval:'1M'
                    }
                }
            }
        }
    })
    console.log("Date histogram results:",body.aggregations.date_histogram)
}


// perfromDateHistogramAggregation();

async function performRangeAggregations(){
    const body = await client.search({
        index:'products0002',
        body:{
            size:0,
            aggs:{
                price_ranges:{
                    range:{
                        field:'price',
                        ranges:[
                            {from:0,to:100},
                            {from:100,to:500},
                            {from:500,to:1000},
                        ]
                    }
                }
            }
        }
    });
    console.log("Range Aggregations results:",body.aggregations.price_ranges)
}

// performRangeAggregations();

async function performMetricAggregations(){
    const body  = await client.search({
        index:'products0002',
        body:{
            size:0,
            aggs:{
                average_ratings:{
                    max:{
                        field:'rating'
                    }
                }
            }
        }
    });
    console.log("Average Rating Aggregation results: ",body.aggregations.average_ratings)
}

performMetricAggregations();








































































