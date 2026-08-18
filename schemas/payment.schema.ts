import { z } from 'zod';

export const initializePaymentSchema = z.object({
  orderId: z.string(),
  method: z.enum(['orange_money', 'mtn_momo', 'cash_on_delivery']),
  phone: z.string().optional()
});
