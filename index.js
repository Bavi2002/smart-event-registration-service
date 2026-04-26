import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import registrationRoutes from './src/routes/registrationRoutes.js';
import swaggerRoutes from "./src/routes/swagger.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/registrations', registrationRoutes);

app.use("/api-docs", swaggerRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Registration Service running on port ${PORT}`);
  });
};

startServer();