import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { selectCartItems, selectCartItemCount, selectCartTotal, updateQuantity, removeFromCart, clearCart } from '../features/cart/cartSlice';
import EmptyState from '../components/ui/EmptyState';
import { formatPrice } from '../utils/formatters';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);

  const handleUpdateQty = (productId, qty, stock) => {
    dispatch(updateQuantity({ productId, quantity: qty, stock }));
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.productId));
    toast.info(`${item.name} removed from cart`);
  };

  const handleClear = () => {
    if (window.confirm('Clear all items from cart?')) {
      dispatch(clearCart());
      toast.info('Cart cleared');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to get started"
          action={<Link to="/products" className="btn-primary">Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Shopping Cart</h1>
          <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>
        <button onClick={handleClear} className="text-red-600 hover:text-red-700 text-sm font-medium">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <Link to={`/products/${item.productId}`} className="shrink-0">
                <img src={item.image} alt={item.name} className="h-24 w-24 object-cover rounded-lg" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 mb-1">{item.name}</Link>
                <p className="text-lg font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdateQty(item.productId, item.quantity - 1, item.stock)} className="p-1.5 border border-gray-300 rounded hover:bg-gray-50" disabled={item.quantity <= 1}><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => handleUpdateQty(item.productId, item.quantity + 1, item.stock)} className="p-1.5 border border-gray-300 rounded hover:bg-gray-50" disabled={item.quantity >= item.stock}><Plus className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleRemove(item)} className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
              <ShoppingBag className="h-5 w-5" />
              Proceed to Checkout
            </Link>
            <Link to="/products" className="btn-secondary w-full text-center block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
