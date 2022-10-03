const express = require("express");
const expressApp = express();
const port =3000;

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
 *      get: /
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
 * /agents:
 *   get:
 *     summary: Returns all the agents from DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /company:
 *   get:
 *     summary: Returns all the company from DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /customer:
 *   get:
 *     summary: Returns all the customer from DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /addagent:
 *   post:
 *     summary: adds an agent record to agentDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The company's id.
 *               name:
 *                 type: string
 *                 description: The company's name.
 *               area:
 *                 type: string
 *                 description: The company's city.
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /addcompany:
 *   post:
 *     summary: adds a company record to companyDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The company's id.
 *               name:
 *                 type: string
 *                 description: The company's name.
 *               city:
 *                 type: string
 *                 description: The company's city.
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /company/{id}:
 *   put:
 *     summary: adds a company record to companyDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The company's name.
 *               city:
 *                 type: string
 *                 description: The company's city.
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /agent/{id}:
 *   patch:
 *     summary: adds a company record to companyDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The company's name.
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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
 * /agent/{id}:
 *   delete:
 *     summary: deletes an agent record to companyDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *          responses:
 *              status: 200 OK
 *              description: requested query successfully retrieved the results
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

expressApp.listen(port, () => console.log("Express Node JS Server is up n running at port 3000.."));

