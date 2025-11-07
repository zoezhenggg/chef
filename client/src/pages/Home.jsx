import { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import OrderModal from '../components/OrderModal';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.item_id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.item_id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { item_id: item.id, quantity: 1, item }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.item_id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.item_id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const itemData = items.find(i => i.id === item.item_id);
      return total + (itemData?.price || 0) * item.quantity;
    }, 0);
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.category === filter);

  const categories = ['all', ...new Set(items.map(item => item.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading delicious items...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Private Chef
        </h1>
        <p className="text-xl text-gray-600">
          Handcrafted food and pastries made with love
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filter === category
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category === 'all' ? 'All Items' : category}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onAddToCart={() => addToCart(item)}
            />
          ))}
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} item(s) in cart
              </div>
              <div className="text-2xl font-bold text-orange-600">
                ${getTotal().toFixed(2)}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCart([])}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setShowOrderModal(true)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          cart={cart}
          items={items}
          total={getTotal()}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            setCart([]);
            setShowOrderModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;


