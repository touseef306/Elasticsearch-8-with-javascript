const express = require("express")
const bodyparser = require("body-parser")
const elasticsearchClient = require("./elasticsearch")


const app = express();

app.use(bodyparser.json());


app.get('/', (req,res) => {
    res.send("Welecome to the Employee management API")
})


app.post('/employees', async (req, res) =>{
    const newEmployee = req.body;

    try{
        const body = await elasticsearchClient.index({
            index:"employees",
            body:newEmployee
        });

        res.send(201).json({id:body._id,...newEmployee});

    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
})


app.get("/employees",async(req,res) =>{
    try{

        const body = await elasticsearchClient.search({
            index:'employees',
            body:{
                query:{
                    match_all:{}
                }
            }
        })

        res.json(body.hits.hits.map(hit => hit._source))
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
})

app.get('/employees/:id', async (req,res) =>{
    const employeeid =req.params.id

    try{
            const body = await elasticsearchClient.get({
                index:'employees',
                id:employeeid
            })

            if(!body.found){
                return res.status(404).send('employee not found')
            }

            res.json(body._source)
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
})
  
app.put('/employees/:id',async(req,res) =>{
    const employeeid = req.params.id;
    const updateEmployee = req.body;

    try{

        const body = await elasticsearchClient.update({
            index:'employees',
            id:employeeid,
            body:{
                doc:updateEmployee
            }
        })

        if(body.result == 'updated'){
            res.status(200).json({id:employeeid,...updateEmployee})
        }else{
            res.status(404).send('Employee not found')
        }
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
})

app.delete('/employees/:id', async(req,res)=>{
    const employeeid = req.params.id;

    try{

        const body = await elasticsearchClient.delete({
            index:'employees',
            id:employeeid
        });

        if(body.result == 'not_found'){
            return res.status(404).send('Employee not found')
        }

        res.status(204).send(); // no content , successful delete
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
})
  
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})