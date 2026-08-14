import { Link } from 'react-router-dom';
import { ShoppingCart, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart, selectCartItemById } from '../../features/cart/cartSlice';
import StarRating from '../ui/StarRating';
import { formatPrice, getDiscountedPrice } from '../../utils/formatters';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(product._id));
  const inCart = cartItem?.quantity || 0;
  const outOfStock = product.quantity === 0;
  const finalPrice = getDiscountedPrice(product.price, product.discount);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    if (inCart >= product.quantity) {
      toast.warning('Maximum available stock already in cart');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product._id}`} className="card group flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden bg-gray-100 h-52">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{product.discount}%
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          <Tag className="h-3 w-3 text-indigo-400" />
          <span className="text-xs text-indigo-600 font-medium">{product.category}</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        {product.brand && <p className="text-xs text-gray-400 mb-2">{product.brand}</p>}

        <StarRating rating={product.rating} />

        <div className="flex items-baseline gap-2 mt-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="mt-auto">
          {product.quantity > 0 && product.quantity <= 5 && (
            <p className="text-xs text-orange-500 font-medium mb-2">Only {product.quantity} left!</p>
          )}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
