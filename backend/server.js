const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/notes', noteRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
