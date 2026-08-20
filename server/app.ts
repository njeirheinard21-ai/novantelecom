import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import paymentsRouter from './routes/payments';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import checkoutRouter from './routes/checkout';
import storeRouter from './routes/store';

const app = express();
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({ origin: process.env.APP_URL || '*' }));

// Payments webhook needs raw body for HMAC verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/payments', paymentsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/admin', adminRouter);
app.use('/api/store', storeRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

export default app;
