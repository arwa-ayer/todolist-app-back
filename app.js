'use strict';

var express = require ('express');
var http = require('http');
var bodyParser = require('body-parser');
const cors = require('cors');
var apiRouter = require('./apiRouter').router;




// App
const server = express();
var server1 = http.createServer(server);


server.use(cors());
server.use(bodyParser.urlencoded({extended:true}));
server.use('/uploads', express.static('uploads'));

server.use((req ,res ,next)=>{res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); next()});
server.use(bodyParser.json());

server.use('/api/', apiRouter);

const config = require(__dirname + '/swagger.json')
var swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// swagger definition
const swaggerDefinition =config; 

// options for swagger jsdoc 
const swaggerOptions = {
    swaggerDefinition: swaggerDefinition, // swagger definition
    apis: ['./apiRouter.js'],
};

// initialize swaggerJSDoc generator (outputs swagger docs as JSON to variable)
const swaggerSpec = swaggerJSDoc(swaggerOptions);
// Server swagger at <apiurl>/docs using swagger-ui-express
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Constants
const PORT = "8080";
const HOST = "0.0.0.0";

server1.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);