import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Menu, X, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-lg">NovaCart<span className="text-indigo-600"> Admin</span></span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              <l.icon className="h-5 w-5" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Sidebar - mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-indigo-600" />
                <span className="font-bold text-lg">NovaCart Admin</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setSidebarOpen(false)}>
                  <l.icon className="h-5 w-5" />
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <Link to="/" className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
