import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import { fetchOrderById, selectCurrentOrder, selectOrdersLoading, selectOrdersError, clearCurrentOrder } from '../features/orders/orderSlice';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatPrice, formatDate, statusBadgeClass } from '../utils/formatters';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => dispatch(clearCurrentOrder());
  }, [id, dispatch]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ErrorMessage message={error} onRetry={() => dispatch(fetchOrderById(id))} /></div>;
  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={statusBadgeClass(order.status)}>{order.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <User className="h-5 w-5" />
              <h3 className="font-semibold">Customer</h3>
            </div>
            <p className="text-sm text-gray-600">{order.customer.name}</p>
            <p className="text-sm text-gray-600">{order.customer.email}</p>
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">Shipping Address</h3>
            </div>
            <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.postalCode}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <CreditCard className="h-5 w-5" />
              <h3 className="font-semibold">Payment</h3>
            </div>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            <p className="text-sm text-gray-500 mt-1">Simulated</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
