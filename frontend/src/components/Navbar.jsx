import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../features/cart/cartSlice';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const cartCount = useSelector(selectCartItemCount);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/orders', label: 'Orders' },
  ];

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Nova<span className="text-indigo-600">Cart</span></span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10 pr-4"
                aria-label="Search products"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors" aria-label="Shopping cart">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10"
                  aria-label="Search products"
                />
              </div>
            </form>
            {navLinks.map((l) => (
              <NavLink
                key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
