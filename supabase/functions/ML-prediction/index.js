import axios from 'axios';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend requests

// ML API Endpoint (Update this to your actual ML API URL)
const ML_API_URL = 'http://127.0.0.1:8000';

// Route to trigger ML model processing
app.post('/predict', async (req, res) => {
    try {
        const { caseData } = req.body;

        // Sending data to the ML API
        const response = await axios.post(`${ML_API_URL}/predict`, caseData);

        // Returning the ML API response to the frontend
        res.json(response.data);
    } catch (error) {
        console.error('ML API Error:', error.message);
        res.status(500).json({ error: 'Failed to process ML prediction' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ML-Prediction API running on port ${PORT}`));
