
import React from 'react';
import { User, UserRole, Complaint, Notice, ComplaintStatus } from '../types';

interface DashboardProps {
  user: User;
  complaints: Complaint[];
  notices: Notice[];
  residents: User[];
  totalRooms: number;
  onNavigate: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, complaints, notices, residents, totalRooms, onNavigate }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  
  const relevantComplaints = isAdmin ? complaints : complaints.filter(c => c.residentId === user.id);
  const occupiedRooms = residents.length;
  const occupancyPercent = (occupiedRooms / totalRooms) * 100;

  const stats = isAdmin ? [
    { label: 'Occupied Rooms', value: `${occupiedRooms} / ${totalRooms}`, color: 'bg-indigo-500', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Total Residents', value: residents.length, color: 'bg-emerald-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Active Issues', value: complaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length, color: 'bg-rose-500', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Notices', value: notices.length, color: 'bg-amber-500', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  ] : [
    { label: 'Your Room', value: user.roomNumber ? `No. ${user.roomNumber}` : 'Pending', color: 'bg-indigo-500', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Meal Plan', value: 'Today: Veg', color: 'bg-emerald-500', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'PG Status', value: 'Healthy', color: 'bg-blue-500', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'New Notices', value: notices.length, color: 'bg-amber-500', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hello, {user.name}! 👋</h2>
          <p className="text-slate-500">{isAdmin ? 'Managing Smart PG Operations' : 'Welcome to your digital home.'}</p>
        </div>
        {!isAdmin && !user.roomNumber && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3 text-rose-700 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-sm font-bold">Please set your Room Number in Profile!</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-inner`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">{isAdmin ? 'Global Issues' : 'Recent Updates'}</h3>
            <button onClick={() => onNavigate(isAdmin ? 'complaints' : 'notices')} className="text-indigo-600 text-sm font-semibold hover:underline">See Detail</button>
          </div>
          <div className="divide-y divide-slate-50">
            {isAdmin ? (
               complaints.slice(0, 4).map(complaint => (
                <div key={complaint.id} className="p-6 hover:bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {complaint.residentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{complaint.type}</p>
                      <p className="text-xs text-slate-500">From Room {residents.find(r => r.id === complaint.residentId)?.roomNumber || '?'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    complaint.status === ComplaintStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{complaint.status}</span>
                </div>
              ))
            ) : (
              notices.slice(0, 4).map(notice => (
                <div key={notice.id} className="p-6 hover:bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{notice.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{notice.content}</p>
                </div>
              ))
            )}
            {(isAdmin ? complaints : notices).length === 0 && <div className="p-12 text-center text-slate-400">No recent activity.</div>}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
           <div>
              <h3 className="text-xl font-bold mb-4">PG Messenger</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Got a question about today's meal or the Wi-Fi password? Our AI assistant is ready to help 24/7.
              </p>
           </div>
           <button 
             onClick={() => onNavigate('chat')}
             className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             <span>Chat with AI</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
