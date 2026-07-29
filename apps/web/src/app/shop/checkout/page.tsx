'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConvertedAmount from '@/components/ConvertedAmount';
import { getCurrentUserId } from '@/lib/auth';
import { publicApi } from '@/lib/publicApi';
import { paymentMethods, paymentMethodLabels, type PaymentMethod } from '@/lib/paymentMethods';

type CartItem = {
  product: any;
  quantity: number;
};

export default function ShopCheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MASTERCARD');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCart() {
      try {
        const raw = localStorage.getItem('cart') || '[]';
        const cart: { productId: string; quantity: number }[] = JSON.parse(raw);
        const products = await Promise.all(
          cart.map((item) => publicApi(`/shop/products/${item.productId}`).catch(() => null)),
        );

        const merged = cart.map((item) => ({
          product: products.find((product: any) => product && product.id === item.productId) || {
            id: item.productId,
            name: 'Unknown product',
            price: 0,
            stock: 0,
          },
          quantity: item.quantity,
        }));

        setItems(merged);
      } catch {
        setMessage('Unable to load your cart');
      } finally {
        setLoading(false);
      }
    }

    void loadCart();
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0), [items]);
  const tax = subtotal * 0.1;
  const shippingCost = items.length > 0 ? 10 : 0;
  const total = subtotal + tax + shippingCost;

  async function submitOrder() {
    const userId = getCurrentUserId();
    if (!userId) {
      setMessage('Please sign in to continue');
      return;
    }

    if (!address.trim()) {
      setMessage('Please enter a shipping address');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        userId,
        shippingAddress: address,
        paymentMethod,
        notes,
      };

      const order = await publicApi('/shop/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.removeItem('cart');
      setItems([]);

      if (paymentMethod === 'BANK_TRANSFER') {
        setMessage(`Order created. Use bank transfer with reference ${order.orderRef} to complete payment.`);
      } else if (paymentMethod === 'CASH') {
        setMessage('Order created. Please pay cash when your delivery is arranged.');
      } else {
        setMessage('Order placed and payment completed successfully.');
      }

      setTimeout(() => router.push('/buyer/orders'), 1000);
    } catch {
      setMessage('Unable to place order');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Preparing checkout…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="mt-3 inline-block text-emerald-400">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-[#0d0d0d] p-6 text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Checkout</h2>
          <p className="mt-1 text-sm text-slate-400">Complete your order and select a payment method.</p>
        </div>
        <Link href="/shop/cart" className="text-sm text-slate-400 hover:text-white">Back to cart</Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-[#121212] p-4">
          <div>
            <label className="text-sm text-slate-400">Shipping address</label>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-2 min-h-[100px] w-full rounded bg-[#0f0f0f] px-3 py-2 text-white"
              placeholder="Enter your delivery address"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-2 min-h-[90px] w-full rounded bg-[#0f0f0f] px-3 py-2 text-white"
              placeholder="Delivery instructions"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
              className="mt-2 w-full rounded bg-[#0f0f0f] px-3 py-2 text-white"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
            <div className="mt-2 text-sm text-slate-400">{paymentMethodLabels[paymentMethod]}</div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-[#121212] p-4">
          <h3 className="text-lg font-semibold text-white">Order summary</h3>
          <div className="space-y-2 text-sm text-slate-300">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between gap-3">
                <span>{item.product.name} × {item.quantity}</span>
                <span><ConvertedAmount amountUsd={(item.product.price || 0) * item.quantity} /></span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-slate-700 pt-3 text-sm text-slate-400">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span><ConvertedAmount amountUsd={subtotal} /></span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span><ConvertedAmount amountUsd={tax} /></span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span><ConvertedAmount amountUsd={shippingCost} /></span>
            </div>
            <div className="flex items-center justify-between pt-2 text-base font-semibold text-white">
              <span>Total</span>
              <span><ConvertedAmount amountUsd={total} /></span>
            </div>
          </div>
          <button
            onClick={submitOrder}
            disabled={submitting}
            className="w-full rounded bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
          {message ? <div className="text-sm text-emerald-300">{message}</div> : null}
        </div>
      </div>
    </div>
  );
}
