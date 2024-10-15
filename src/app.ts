import express from 'express';
import bodyParser from 'body-parser';
import patientRoutes from './routes/patientRoutes';
import rateLimit from 'express-rate-limit'
import { config } from "dotenv";
config();
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use(bodyParser.json());
app.use(limiter)
app.use(`/${process.env.ROUTES_PREFIX}`, patientRoutes);

const PORT = process.env.PORT || 3000;

app.get('/health',(req,res)=>{
  res.status(200).json({message:"Server is up and running"})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
