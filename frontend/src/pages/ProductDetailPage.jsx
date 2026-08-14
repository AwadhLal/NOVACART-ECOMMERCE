import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ShoppingCart, Tag, ArrowLeft, Minus, Plus } from 'lucide-react';
import { fetchProductById, selectCurrentProduct, selectProductsLoading, selectProductsError, clearCurrentProduct } from '../features/products/productSlice';
import { addToCart, selectCartItemById } from '../features/cart/cartSlice';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatPrice, getDiscountedPrice } from '../utils/formatters';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const cartItem = useSelector(selectCartItemById(id));

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={() => dispatch(fetchProductById(id))} />
      </div>
    );
  }

  if (!product) return null;

  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const outOfStock = product.quantity === 0;
  const inCart = cartItem?.quantity || 0;
  const maxQty = Math.max(0, product.quantity - inCart);

  const handleAddToCart = () => {
    if (quantity > maxQty) {
      toast.warning(`Only ${maxQty} more available`);
      return;
    }
    dispatch(addToCart({ product, quantity }));
    toast.success(`${quantity} × ${product.name} added to cart`);
    setQuantity(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="card overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/500x500?text=No+Image'; }}
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="flex items-center gap-1 mb-2 text-sm text-indigo-600 hover:text-indigo-700 w-fit">
            <Tag className="h-3.5 w-3.5" />
            {product.category}
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          {product.brand && <p className="text-gray-500 mb-3">{product.brand}</p>}

          <div className="flex items-center gap-4 mb-6">
            <StarRating rating={product.rating} size="md" />
            {product.sku && <span className="text-xs text-gray-400">SKU: {product.sku}</span>}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">-{product.discount}%</span>
              </>
            )}
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {outOfStock ? (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            ) : product.quantity <= 10 ? (
              <span className="text-orange-500 font-semibold">Only {product.quantity} left in stock!</span>
            ) : (
              <span className="text-green-600 font-semibold">In Stock ({product.quantity} available)</span>
            )}
          </div>

          {/* Quantity */}
          {!outOfStock && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(val, maxQty)));
                  }}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  min="1"
                  max={maxQty}
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity >= maxQty}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-500">(Max: {maxQty})</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || maxQty === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {outOfStock ? 'Out of Stock' : maxQty === 0 ? 'Max in Cart' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="btn-secondary">
              View Cart
            </Link>
          </div>

          {inCart > 0 && (
            <p className="text-sm text-indigo-600 mt-3">
              {inCart} already in your cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
