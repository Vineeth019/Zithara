const cors = require('cors');
const { Client } = require('pg');
const express = require('express');

const PORT = 5000;
const app = express();
app.use(cors());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ZitharaProject',
    password: 'Omsairam_1',
    port: 5432 
});

client.connect();

app.get('/api/users', async (req, res) => {
    const {page} = req.query;
    const offset = (page - 1) * 20;
    try {
        const queryResult = await client.query(`SELECT * FROM Public."Users" ORDER BY "Sno" OFFSET $1 LIMIT 20`, [offset]);
        console.log(queryResult.rows);
        res.json(queryResult.rows);
    } catch (err) {
        console.error('Error fetching records:', err);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

app.get('/api/search', async (req, res) => {
    const { prompt ,sortBy } = req.query;
    console.log(prompt,sortBy);
    if(prompt == ""){
        console.log("PROMPT NULL")
        if (sortBy == 'date') {
            try {
                const queryResult = await client.query(`SELECT * FROM Public."Users" ORDER BY DATE_TRUNC('day', "Created_At");`);
                console.log(queryResult.rows);
                res.json(queryResult.rows);
            } catch (err) {
                console.error('Error fetching records:', err);
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
        else if (sortBy == 'time') {
            try {
                console.log("TIME IMINENT");
                const queryResult = await client.query(`SELECT * FROM Public."Users" ORDER BY EXTRACT(HOUR FROM "Created_At"), EXTRACT(MINUTE FROM "Created_At"), EXTRACT(SECOND FROM "Created_At");`);
                console.log(queryResult.rows);
                res.json(queryResult.rows);
            } catch (err) {
                console.error('Error fetching records:', err);
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
    }
    // Prompt Not NULL
    else{
        if (sortBy == 'date') {
            try {
                const queryResult = await client.query(`SELECT * FROM Public."Users" WHERE "CustomerName" = $1 OR "Location"=$1 ORDER BY DATE_TRUNC('day', "Created_At");`, [prompt]);
                console.log(queryResult.rows);
                res.json(queryResult.rows);
            } catch (err) {
                console.error('Error fetching records:', err);
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
        else if (sortBy == 'time') {
            try {
                const queryResult = await client.query(`SELECT * FROM Public."Users" WHERE "CustomerName"=$1 OR "Location"=$1 ORDER BY EXTRACT(HOUR FROM "Created_At"), EXTRACT(MINUTE FROM "Created_At"), EXTRACT(SECOND FROM "Created_At");`, [prompt]);
                console.log(queryResult.rows);
                res.json(queryResult.rows);
            } catch (err) {
                console.error('Error fetching records:', err);
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});