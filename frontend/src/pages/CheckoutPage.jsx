import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cart/cartSlice';
import { createOrder } from '../features/orders/orderSlice';
import { formatPrice } from '../utils/formatters';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', state: '', postalCode: '', country: '',
    paymentMethod: 'Credit Card',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        customer: { name: form.name, email: form.email, phone: form.phone },
        items: items.map(i => ({ product: i.productId, quantity: i.quantity })),
        paymentMethod: form.paymentMethod,
        shippingAddress: { street: form.street, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
      };
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${result._id}`);
    } catch (err) {
      toast.error(err || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center"><p className="text-gray-600">Your cart is empty.</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" className="input-field" required />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email *" className="input-field" required />
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone *" className="input-field sm:col-span-2" required />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <input name="street" value={form.street} onChange={handleChange} placeholder="Street Address *" className="input-field" required />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City *" className="input-field" required />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code *" className="input-field" required />
                <input name="country" value={form.country} onChange={handleChange} placeholder="Country *" className="input-field" required />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input-field" required>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">* Payment is simulated for demonstration purposes</p>
          </div>
        </div>

        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 pb-4 border-b">
              {items.map(i => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">{i.name} × {i.quantity}</span>
                  <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
