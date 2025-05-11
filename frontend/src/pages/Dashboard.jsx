import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

export function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-start gap-8">
        {/* Left Column */}
        <div className="w-1/4 space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                alt="John Smith"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="font-medium text-gray-900">Welcome, John Smith</h2>
              </div>
            </div>
            <button className="w-full bg-black text-white rounded-lg py-2 text-sm">
              View Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 bg-white rounded-lg p-3 hover:bg-gray-50">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm">Set Availability</span>
            </button>
            <button className="w-full flex items-center gap-3 bg-white rounded-lg p-3 hover:bg-gray-50">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm">View Progress</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-8">
          {/* Performance Overview */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
            
            {/* Chart */}
            <div className="h-48 bg-[#1E293B] rounded-lg mb-8 p-4">
              <div className="h-full flex items-end justify-between gap-4">
                {[40, 25, 60, 30, 80, 50, 70, 45].map((height, i) => (
                  <div key={i} className="w-full">
                    <div 
                      className="bg-white/20 rounded-t-sm" 
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Hours</h3>
                <p className="text-2xl font-semibold">32,984</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Points</h3>
                <p className="text-2xl font-semibold">2.42m</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Tasks</h3>
                <p className="text-2xl font-semibold">2,400</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Projects</h3>
                <p className="text-2xl font-semibold">320</p>
              </div>
            </div>
          </div>

          {/* Projects and Orders */}
          <div className="grid grid-cols-2 gap-8">
            {/* Projects */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Projects</h2>
              <div className="space-y-4">
                {[
                  { name: 'Chakra Soft UI Version', budget: '$14,000', progress: 60 },
                  { name: 'Add Progress Track', budget: '$3,000', progress: 10 },
                  { name: 'Fix Platform Errors', budget: 'Not set', progress: 100 },
                  { name: 'Launch our Mobile App', budget: '$32,000', progress: 100 },
                  { name: 'Add the New Pricing Page', budget: '$400', progress: 25 },
                  { name: 'Redesign New Online Shop', budget: '$7,600', progress: 40 },
                ].map((project) => (
                  <div key={project.name} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-1">{project.name}</h3>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{project.budget}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Overview */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Orders overview</h2>
                <span className="text-sm text-green-500">+30%</span>
              </div>
              <div className="space-y-6">
                {[
                  { title: '$2400, Design changes', time: '22 DEC 7:20 PM' },
                  { title: 'New order #4219423', time: '21 DEC 11:21 PM' },
                  { title: 'Server Payments for April', time: '21 DEC 9:28 PM' },
                  { title: 'New card added for order #4219145', time: '20 DEC 3:52 PM' },
                  { title: 'Unlock packages for Development', time: '19 DEC 11:35 PM' },
                  { title: 'New order #9851258', time: '18 DEC 4:41 PM' }
                ].map((order, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${i % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{order.title}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}