import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { fetchProducts, selectAllProducts, selectProductsLoading, deleteProduct } from '../../features/products/productSlice';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { formatPrice } from '../../utils/formatters';
import StarRating from '../../components/ui/StarRating';

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteProduct(deleteId)).unwrap();
      toast.success('Product deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="h-5 w-5" /> Add Product
        </Link>
      </div>

      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Price</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Stock</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Rating</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded" onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=No'; }} />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                        {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{formatPrice(p.price)}</td>
                  <td className="p-4 text-sm">
                    <span className={p.quantity <= 10 ? 'text-orange-600 font-semibold' : 'text-gray-900'}>{p.quantity}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{p.category}</td>
                  <td className="p-4"><StarRating rating={p.rating} /></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${p._id}/edit`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit className="h-4 w-4" /></Link>
                      <button onClick={() => setDeleteId(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
