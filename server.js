const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => console.log('Server running on port', port));

// Get all characters
app.get('/characters', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM HSR');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for all characters' });
    }
});

// Add character
app.post('/addcharacter', async (req, res) => {
    const { name, combat_type, combat_path, rarity, character_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO HSR (name, combat_type, combat_path, rarity, character_pic) VALUES (?, ?, ?, ?, ?)',
            [name, combat_type, combat_path, rarity, character_pic]
        );
        res.status(201).json({ message: "Character added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error - could not add character " + name });
    }
});

// Update character
app.put('/updatecharacter/:id', async (req, res) => {
    const { id } = req.params;
    const { name, combat_type, combat_path, rarity, character_pic } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE HSR SET name=?, combat_type=?, combat_path=?, rarity=?, character_pic=? WHERE id=?',
            [name, combat_type, combat_path, rarity, character_pic, id]
        );
        res.status(201).json({ message: 'Character ' + id + ' updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update character ' + id });
    }
});

// Delete character
app.delete('/deletecharacter/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM HSR WHERE id=?', [id]);
        res.status(201).json({ message: 'Character ' + id + ' deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete character ' + id });
    }
});
