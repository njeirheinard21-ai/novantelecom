import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Container } from '../components/ui/Container';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function CheckoutWait() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) {
      setError("No payment ID provided");
      return;
    }

    const unsub = onSnapshot(doc(db, 'payments', paymentId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(data.status);
        if (data.status === 'successful') {
          setTimeout(() => navigate('/account/orders'), 2000);
        } else if (data.status === 'failed' || data.status === 'amount_mismatch') {
          setError(`Payment failed: ${data.status}`);
        }
      } else {
        setError("Payment not found");
      }
    });

    return () => unsub();
  }, [paymentId, navigate]);

  return (
    <Container className="py-24 text-center max-w-lg">
      <h1 className="text-4xl font-semibold tracking-tight mb-4">
        {status === 'successful' ? 'Payment Successful!' : error ? 'Payment Failed' : 'Waiting for payment'}
      </h1>
      <p className="text-fg/80 mb-8">
        {status === 'successful' 
          ? 'Thank you! Your payment has been confirmed. Redirecting to your orders...'
          : error 
            ? error
            : 'Please complete your payment. This page will automatically update once the payment is confirmed.'}
      </p>
      
      {status === 'pending' && (
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
      )}

      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/account/orders')} className="text-accent hover:underline">
          View My Orders
        </button>
      </div>
    </Container>
  );
}
