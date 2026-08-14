import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FolderOpen } from 'lucide-react';
import { fetchCategories, selectAllCategories, selectCategoriesLoading, selectCategoriesError } from '../features/categories/categorySlice';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ErrorMessage message={error} onRetry={() => dispatch(fetchCategories())} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
        <p className="text-gray-600">Browse products by category</p>
      </div>

      {categories.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No categories found" description="Categories will appear here once added" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/products?category=${encodeURIComponent(cat.name)}`} className="card hover:shadow-md transition-shadow group">
              <div className="h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                <img src={cat.image} alt={cat.name} className="h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-300" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
