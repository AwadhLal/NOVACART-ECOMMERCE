import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { createProduct, updateProduct } from '../../features/products/productSlice';
import { fetchCategories, selectAllCategories } from '../../features/categories/categorySlice';

export default function ProductForm({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', quantity: '', rating: '', category: '',
    image: '', brand: '', sku: '', discount: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (product) setForm({ ...product, price: product.price.toString(), quantity: product.quantity.toString(), rating: product.rating.toString(), discount: product.discount.toString() });
  }, [product, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        rating: parseFloat(form.rating) || 0,
        discount: parseFloat(form.discount) || 0,
      };
      if (product) {
        await dispatch(updateProduct({ id: product._id, data })).unwrap();
        toast.success('Product updated');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{product ? 'Edit' : 'Add'} Product</h1>

      <form onSubmit={handleSubmit} className="card p-6 max-w-3xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input name="name" value={form.name} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand</label><input name="brand" value={form.brand} onChange={handleChange} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea name="description" value={form.description} onChange={handleChange} rows="3" className="input-field" required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price *</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label><input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="input-field" required /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label><input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label><input name="discount" type="number" step="1" min="0" max="100" value={form.discount} onChange={handleChange} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU</label><input name="sku" value={form.sku} onChange={handleChange} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input name="image" type="url" value={form.image} onChange={handleChange} className="input-field" /></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
