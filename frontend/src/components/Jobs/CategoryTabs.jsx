import React from 'react';

function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex space-x-6 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`whitespace-nowrap px-3 py-2 rounded-full text-sm ${
                category === activeCategory
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryTabs;
