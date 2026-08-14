import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { fetchCategories, selectAllCategories, selectCategoriesLoading, createCategory, updateCategory, deleteCategory } from '../../features/categories/categorySlice';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCategoriesLoading);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (cat) => {
    setForm(cat);
    setEditMode(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await dispatch(updateCategory({ id: editMode, data: form })).unwrap();
        toast.success('Category updated');
      } else {
        await dispatch(createCategory(form)).unwrap();
        toast.success('Category created');
      }
      resetForm();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteCategory(deleteId)).unwrap();
      toast.success('Category deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', image: '' });
    setShowForm(false);
    setEditMode(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category Name *" className="input-field" required />
            <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows="2" className="input-field" />
            <input name="image" type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="input-field" />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editMode ? 'Update' : 'Create'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(c => (
            <div key={c._id} className="card overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img src={c.image} alt={c.name} className="h-24 w-24 object-contain" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{c.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(c)} className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"><Edit className="h-4 w-4" /> Edit</button>
                  <button onClick={() => setDeleteId(c._id)} className="flex-1 btn-danger text-sm py-2 flex items-center justify-center gap-1"><Trash2 className="h-4 w-4" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
