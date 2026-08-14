import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package } from 'lucide-react';
import { fetchOrders, selectAllOrders, selectOrdersLoading, selectOrdersError } from '../features/orders/orderSlice';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import { formatPrice, formatDate, statusBadgeClass } from '../utils/formatters';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ErrorMessage message={error} onRetry={() => dispatch(fetchOrders())} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" description="Orders you place will appear here" action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-6 hover:shadow-md transition-shadow block">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                    <span className={statusBadgeClass(order.status)}>{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
