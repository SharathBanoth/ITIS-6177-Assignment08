const express = require("express");
const expressApp = express();
const port =3000;
const axios = require('axios');

expressApp.use(express.json());
expressApp.use(express.urlencoded({extended:false}));

const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const sanitizer = require('sanitize');

const options = {
    definition: {
      ITIS_6177: 'Assg/Quiz: 8',
      info: {
        title: 'RestLike-Swagger',
        version: '1.0.0',
      },
      host: 'http://167.99.146.6:3000',
      basePath: '/'
    },
    apis: ['./expressServerDB.js'],
};

const Specification = swaggerJSdoc(options);

expressApp.use('/api-docs', swaggerUI.serve, swaggerUI.setup(Specification));

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    connectionLimit: 50
})

/**
 * @swagger
 *      /:
 *      get:
 *          description: Landing page
 *          produces:
 *              -JSON
 *          responses:
 *              status: 200 OK
 *              description: Landing pages. Provide information of available end points
 */
expressApp.get('/', (req,res) => {
    res.send("Please redirect to /agents or /customer or /company ...");
});

/**
 * @swagger
 *      /agents:
 *      get:
 *          description: GET's all the records from sample.agents DB
 *          produces:
 *              -JSON
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
expressApp.get('/agents', async (req, res) => {
    try {
        let connection = await pool.getConnection();
        console.log("In '/agents' route"); 
        sqlQuery = 'SELECT * FROM agents';
        const rows = await connection.query(sqlQuery);
        res.json(rows)
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 *      /company:
 *      get:
 *          description: GET's all the records from sample.company DB
 *          produces:
 *              -JSON
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.get('/company', async (req, res) => {        
    try {                                               
        let connection = await pool.getConnection();    
        console.log("In '/company' route");             
        sqlQuery = 'SELECT * FROM company'              
        const rows = await connection.query(sqlQuery);  
        res.json(rows);                                 
        (await connection).end;                         
    } catch (error) {                                   
        console.log(error);                             
    }                                                   
});                                                     

/**
 * @swagger
 *      /customer:
 *      get:
 *          description: GET's all the records from sample.customer DB
 *          produces:
 *              -JSON
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.get('/customer', async (req, res) => {          
    try {                                                  
        let connection = await pool.getConnection();       
        console.log("In '/customer' route");               
        sqlQuery = 'SELECT * FROM customer'                
        const rows = await connection.query(sqlQuery);     
        res.json(rows);                                    
        (await connection).end;                            
    } catch (error) {                                      
        console.log(error);                                
    }                                                      
});

/**
 * @swagger
 *      /addagent:
 *      post:
 *          description: POST's a records INTO sample.agents DB
 *          produces:
 *              -JSON
 *          parameters:
 *              [AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION]
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.post('/addagent', async (req, res) => {
    try {
        let connection = await pool.getConnection();
        console.log("In '/addagents' route");

        req.checkBody('AGENT_CODE', 'Id is required!').notEmpty();
        req.checkBody('AGENT_NAME', 'Name is required!').notEmpty();
        req.checkBody('WORKING_AREA', 'City is required!').notEmpty();
        req.checkBody('COMMISSION', 'Commission is required!').notEmpty();

        AGENT_CODE = sanitizer.value(req.body.AGENT_CODE, 'string').trim();
        AGENT_NAME = sanitizer.value(req.body.AGENT_NAME, 'string').trim();
        WORKING_AREA = sanitizer.value(req.body.WORKING_AREA, 'string').trim();
        COMMISSION = sanitizer.value(req.body.COMMISSION, 'string').trim();
        const {AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION} = req.body;
        sqlQuery = 'INSERT into agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION) VALUES (?,?,?,?)';
        const rows = await connection.query(sqlQuery, [AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION]);
        res.json(rows)
    } catch (error) {
        console.log(error);
    }
});


/**
 * @swagger
 *      /addcompany:
 *      post:
 *          description: POST's a records INTO sample.company DB
 *          produces:
 *              -JSON
 *          parameters:
 *              [COMPANY_ID, COMPANY_NAME, COMPANY_CITY]
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.post('/addcompany', async (req, res) => {
    try {
        let connection = await pool.getConnection();
        console.log("In '/addcompany' route");
        req.checkBody('COMPANY_ID', 'Id is required!').notEmpty();
        req.checkBody('COMPANY_NAME', 'Name is required!').notEmpty();
        req.checkBody('COMPANY_CITY', 'City is required!').notEmpty();

        COMPANY_ID = sanitizer.value(req.body.COMPANY_ID, 'string').trim();
        COMPANY_NAME = sanitizer.value(req.body.COMPANY_NAME, 'string').trim();
        COMPANY_CITY = sanitizer.value(req.body.COMPANY_CITY, 'string').trim();

        const {COMPANY_ID, COMPANY_NAME, COMPANY_CITY} = req.body;
        sqlQuery = 'INSERT into company (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) VALUES (?,?,?)';
        const rows = await connection.query(sqlQuery, [COMPANY_ID, COMPANY_NAME, COMPANY_CITY]);
        res.json(rows)
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 *      /company/{id}:
 *      put:
 *          description: PUT's a records FROM sample.company DB
 *          produces:
 *              -JSON
 *          parameters:
 *              [COMPANY_ID, COMPANY_NAME, COMPANY_CITY]
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.put('/company/:id', async (req, res) => {
    try {
        let connection = await pool.getConnection();
        console.log("In '/company .. PUT' route");
        let id = req.params.id;

        req.checkBody('COMPANY_NAME', 'Name is required!').notEmpty();
        req.checkBody('COMPANY_CITY', 'City is required!').notEmpty();

        COMPANY_NAME = sanitizer.value(req.body.COMPANY_NAME, 'string').trim();
        COMPANY_CITY = sanitizer.value(req.body.COMPANY_CITY, 'string').trim();
        let {COMPANY_NAME, COMPANY_CITY} = req.body
        sqlQuery = "UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? WHERE COMPANY_ID = ?";
        const rows = await connection.query(sqlQuery,[COMPANY_NAME, COMPANY_CITY, id]);
        res.json(rows)
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 *      /agent/{id}:
 *      patch:
 *          description: PATCH's a records value FROM sample.agents DB
 *          produces:
 *              -JSON
 *          parameters:
 *              [COMPANY_ID, COMPANY_NAME, COMPANY_CITY]
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.patch('/agent/:id', async (req, res) => {
    try {
        let connection = await pool.getConnection();
        console.log("In '/agent .. PATCH' route");
        let id = req.params.id;
        req.checkBody('AGENT_NAME', 'Name is required!').notEmpty();

        AGENT_NAME = sanitizer.value(req.body.AGENT_NAME, 'string').trim();
        let {AGENT_NAME} = req.body
        sqlQuery = "UPDATE agents SET AGENT_NAME = ? WHERE AGENT_CODE = ?";
        const rows = await connection.query(sqlQuery,[AGENT_NAME, id]);
        res.json(rows)
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 *      /agent/{id}:
 *      delete:
 *          description: DELETE's a records FROM sample.agents DB
 *          produces:
 *              -JSON
 *          parameters:
 *              [COMPANY_ID, COMPANY_NAME, COMPANY_CITY]
 *          responses:
 *              status: 200 OK
 *              description: Successfully retrieved query result(s)
 */
 expressApp.delete('/agent/:id', async (req, res) => {
    try {
        let connection = await pool.getConnection();
        console.log("In '/agent .. DLT' route");
        let id = req.params.id;
        sqlQuery = "DELETE FROM agents WHERE AGENT_CODE = ?";
        const rows = await connection.query(sqlQuery, [id]);
        res.json(rows)
    } catch (error) {
        console.log(error);
    }
});

// expressApp.get('/say', async (req, res) => {          
//     try {                                                      
//         console.log("In '/say' route");
//         let keyword = req.query.keyword;
//         let axiosOut = axios.get('https://7zhiczrwqixekvn6jpjqxveldu0mzxsx.lambda-url.us-east-2.on.aws');
//         res.status(200).json(axiosOut);                                    
//     } catch (error) {                                      
//         console.log(error);                                
//     }                                                      
// });
expressApp.get("/say",async(req,res)=>{
    let urlOfLambdaFunction = "https://7zhiczrwqixekvn6jpjqxveldu0mzxsx.lambda-url.us-east-2.on.aws?keyword="+req.query.keyword;
    axios.get(urlOfLambdaFunction)
    .then((response)=>{
         res.json(response.data);
        }
    )
});

expressApp.listen(port, () => console.log("Express Node JS Server is up n running at port 3000.."));

