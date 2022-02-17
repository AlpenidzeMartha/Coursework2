//import express
const express = require('express');
//express instance
const app = express();

var path =require("path");
var fs =require ("fs");

//parse the request parameters
app.use(express.json());

//serve the static files
app.use(express.static('public'));

//app.set('port', 3000)

//logger middleware 
app.use ((req,res,next) => {
    //allow diffrent IP address
    res.setHeader('Access-Control-Allow-Origin', '*');
    //allow different header fields
    res.header("Access-Control-Allow-Headers","*");
    next();
})

//static middleware                             


app.use(function(req, res, next) {
    var filePath = path.join(__dirname,  "images", req.url);
    fs.stat(filePath, function(err, fileInfo){
        if (err) {
            next();
            return;
            }
            if (fileInfo.isFile()) res.sendFile(filePath);
            else next();
            
        });
    });
    
// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
    let db;
    MongoClient.connect('mongodb+srv://Martha:marthako12@cluster0.ssnjx.mongodb.net', (err, client) => {
    db = client.db('Coursework')
})


// display a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/lessons')
})

//get the collection name 


app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})



//adding post with POST
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)
    res.send(results.ops)
    })
    })


    //update an object with PUT

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
    })
    

    
//delete an object with DELETE
// app.delete('/collection/:collectionName/:id', (req, res, next) => {
//     req.collection.deleteOne(
//     { _id: ObjectID(req.params.id) },(e, result) => {
//     if (e) return next(e)
//     res.send((result.result.n === 1) ?
//     {msg: 'success'} : {msg: 'error'})
//     })
//     })

    // PUT route to reduce value of specified attribute of the record in database
app.put('/collection/:collectionName/:id/reduce/:name/:value', (req, res, next) => {

    let value = -1 * parseInt(req.params.value);
    let name = req.params.name;

    const attr = {};
    attr[name] = value;

    req.collection.updateOne(
        { _id: new ObjectID(req.params.id) },
        { "$inc": attr },
        { safe: true, multi: false },
        (e, result) => {
            if(e || result.result.n !== 1) return next();
            res.json({ message: 'success' });
        });
});

const port = process.env.PORT || 3000;

app.listen(port,()=> {
    console.log('express server is runnimg at localhost:3000')
})