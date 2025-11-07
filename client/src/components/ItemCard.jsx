function ItemCard({ item, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {item.image_url ? (
          <img
            src={`http://localhost:3001${item.image_url}`}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
          <span className="text-2xl font-bold text-orange-600">
            ${parseFloat(item.price).toFixed(2)}
          </span>
        </div>
        {item.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded mb-2">
            {item.category}
          </span>
        )}
        {item.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>
        )}
        <button
          onClick={onAddToCart}
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ItemCard;


