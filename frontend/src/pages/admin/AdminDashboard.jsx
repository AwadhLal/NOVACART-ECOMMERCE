import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../../api/dashboardService';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { formatPrice, formatDate, statusBadgeClass } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-indigo-500' },
    { label: 'Low Stock Items', value: stats.lowStockCount, icon: AlertTriangle, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map(order => (
                <Link key={order._id} to={`/admin/orders`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{formatPrice(order.totalAmount)}</p>
                    <span className={`${statusBadgeClass(order.status)} text-xs`}>{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Products</h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No low stock items</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.slice(0, 5).map(product => (
                <Link key={product._id} to={`/admin/products`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=No'; }} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">{product.quantity} left</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
