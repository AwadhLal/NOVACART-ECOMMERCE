import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Search, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import { fetchProducts, selectAllProducts, selectProductsLoading } from '../features/products/productSlice';
import { fetchCategories, selectAllCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 opacity-90" strokeWidth={1.5} />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to NovaCart
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Discover premium products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
              Shop Now
            </Link>
            <Link to="/categories" className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Search CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Search className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Looking for something specific?</h2>
          <p className="text-gray-600 mb-6">Search our entire catalog to find exactly what you need.</p>
          <Link to="/products" className="btn-primary inline-block">
            Search Products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card hover:shadow-md transition-shadow text-center p-6"
              >
                <div className="h-20 w-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                  <img src={cat.image} alt={cat.name} className="h-12 w-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/categories" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Shop */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Shop with NovaCart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Get your orders delivered quickly and reliably to your doorstep.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600 text-sm">Shop with confidence knowing your data is protected.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <HeadphonesIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Our team is always here to help with any questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-indigo-100 text-lg mb-8">Browse our entire catalog and find your next favorite product.</p>
          <Link to="/products" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
}
