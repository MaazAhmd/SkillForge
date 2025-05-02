import React from 'react';

function Tabs({ activeTab, setActiveTab }) {
  const tabOptions = ['active', 'completed', 'applied', 'saved', 'expired'];

  return (
    <div className="flex md:space-x-6 space-x-4 mb-6">
      {tabOptions.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`capitalize ${
            activeTab === tab
              ? 'text-gray-900 border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          } pb-2`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
