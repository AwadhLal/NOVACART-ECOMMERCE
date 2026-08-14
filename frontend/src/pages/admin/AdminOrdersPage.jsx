import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchOrders, selectAllOrders, selectOrdersLoading, updateOrderStatus, deleteOrder } from '../../features/orders/orderSlice';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { formatPrice, formatDate, statusBadgeClass } from '../../utils/formatters';
import { Trash2, Eye, X } from 'lucide-react';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteOrder(deleteId)).unwrap();
      toast.success('Order deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Order #</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Customer</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Total</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-sm">{o.orderNumber}</td>
                <td className="p-4 text-sm">{o.customer.name}</td>
                <td className="p-4 text-sm font-semibold">{formatPrice(o.totalAmount)}</td>
                <td className="p-4 text-sm text-gray-600">{formatDate(o.createdAt)}</td>
                <td className="p-4">
                  <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setViewOrder(o)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(o._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewOrder(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-semibold">{viewOrder.orderNumber}</h3>
              <button onClick={() => setViewOrder(null)} className="p-2 hover:bg-gray-100 rounded"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><p className="text-sm text-gray-600">Customer</p><p className="font-medium">{viewOrder.customer.name}</p><p className="text-sm text-gray-600">{viewOrder.customer.email} | {viewOrder.customer.phone}</p></div>
              <div><p className="text-sm text-gray-600">Shipping</p><p className="text-sm">{viewOrder.shippingAddress.street}, {viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.postalCode}, {viewOrder.shippingAddress.country}</p></div>
              <div><p className="text-sm text-gray-600 mb-2">Items</p>
                {viewOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-lg font-bold pt-2"><span>Total</span><span>{formatPrice(viewOrder.totalAmount)}</span></div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Order" message="Delete this order?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}
