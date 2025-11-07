import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange-600">
              🍽️ Private Chef
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Menu
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </Link>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


