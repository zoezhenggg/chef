import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Check, ChefHat, Clock, DollarSign, Phone, Mail } from 'lucide-react';

const PrivateChefApp = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Sample menu items - you'll customize these with your actual dishes
  const menuItems = [
    {
      id: 1,
      name: "Truffle Mac & Cheese",
      category: "mains",
      price: 28,
      image: "https://images.unsplash.com/photo-1543826173-1beebfeb7dee?w=400&h=300&fit=crop",
      description: "Creamy mac & cheese with black truffle and gruyère",
      prepTime: "45 min"
    },
    {
      id: 2,
      name: "Lemon Raspberry Tart",
      category: "pastries",
      price: 32,
      image: "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&h=300&fit=crop",
      description: "Fresh lemon curd with seasonal raspberries",
      prepTime: "2 hours"
    },
    {
      id: 3,
      name: "Herb-Crusted Salmon",
      category: "mains",
      price: 38,
      image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop",
      description: "Pan-seared salmon with dill and parsley crust",
      prepTime: "30 min"
    },
    {
      id: 4,
      name: "Chocolate Soufflé",
      category: "pastries",
      price: 22,
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
      description: "Dark chocolate soufflé with vanilla cream",
      prepTime: "1 hour"
    },
    {
      id: 5,
      name: "Beef Wellington",
      category: "mains",
      price: 65,
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop",
      description: "Tenderloin wrapped in puff pastry with mushroom duxelles",
      prepTime: "3 hours"
    },
    {
      id: 6,
      name: "Croissant Selection",
      category: "pastries",
      price: 18,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
      description: "Assorted butter croissants (6 pieces)",
      prepTime: "24 hours notice"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'mains', label: 'Main Dishes' },
    { id: 'pastries', label: 'Pastries & Desserts' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setCart([]);
      setShowCart(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-2 rounded-full">
              <ChefHat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Chef's Kitchen</h1>
              <p className="text-sm text-gray-600">Artisan Meals & Pastries</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition flex items-center gap-2 shadow-lg"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Handcrafted Culinary Experiences</h2>
          <p className="text-xl opacity-90 mb-6">Order fresh, locally-prepared gourmet meals and pastries</p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Made to Order</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>Local Pickup/Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 justify-center flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock size={16} />
                  <span>{item.prepTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">${item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <button onClick={() => setShowCart(false)} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ShoppingCart size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-orange-500 font-bold">${item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-500">${totalPrice.toFixed(2)}</span>
                  </div>

                  {!orderSubmitted ? (
                    <form onSubmit={handleSubmitOrder} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <textarea
                        placeholder="Special requests or dietary restrictions"
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition"
                      >
                        Place Order
                      </button>
                    </form>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                      <Check size={48} className="text-green-500 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-green-700 mb-2">Order Received!</h3>
                      <p className="text-green-600">We'll contact you shortly to confirm.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChefApp;