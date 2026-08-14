import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, X } from 'lucide-react';
import { fetchProducts, selectAllProducts, selectProductsLoading, selectProductsError } from '../features/products/productSlice';
import { fetchCategories, selectAllCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(categoryFilter);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter) params.category = categoryFilter;
    dispatch(fetchProducts(params));
  }, [searchQuery, categoryFilter, dispatch]);

  useEffect(() => {
    setLocalSearch(searchQuery);
    setLocalCategory(categoryFilter);
  }, [searchQuery, categoryFilter]);

  const applyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (localSearch.trim()) params.search = localSearch.trim();
    if (localCategory) params.category = localCategory;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setLocalCategory('');
    setSearchParams({});
  };

  const hasFilters = searchQuery || categoryFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">Discover our complete catalog</p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <form onSubmit={applyFilters} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by name or description"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={localCategory}
                onChange={(e) => setLocalCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-secondary flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </form>

        {hasFilters && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {searchQuery && <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Search: {searchQuery}</span>}
            {categoryFilter && <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Category: {categoryFilter}</span>}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts({ search: searchQuery, category: categoryFilter }))} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No products found"
          description={hasFilters ? 'Try adjusting your filters' : 'No products available at the moment'}
          action={hasFilters ? <button onClick={clearFilters} className="btn-primary">Clear Filters</button> : null}
        />
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
