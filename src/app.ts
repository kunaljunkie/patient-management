import express from 'express';
import bodyParser from 'body-parser';
import patientRoutes from './routes/patientRoutes';
import rateLimit from 'express-rate-limit'

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use(bodyParser.json());
app.use(limiter)
app.use('/api', patientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
