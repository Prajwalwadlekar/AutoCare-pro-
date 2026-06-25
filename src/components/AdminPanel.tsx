import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Phone, Mail, FileText, Loader2, ArrowLeft, Search, Filter, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  car: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  created_at: string;
}

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setLoginError('Error connecting to server. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      console.error(err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update booking');
      
      // Update local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700'; // Pending
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-light-bg flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Admin Access</h2>
            <p className="text-text-muted mt-2 text-center">Login to manage service bookings</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button onClick={onBack} className="text-sm text-text-muted hover:text-primary flex items-center justify-center mx-auto transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center text-primary hover:text-accent font-medium mb-4 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading">Admin Panel</h1>
            </div>
            <p className="text-text-muted mt-2">Manage all customer bookings and update their statuses.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none appearance-none bg-white w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-white border border-gray-200 text-text-dark px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
            <p className="font-medium">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No bookings found</h3>
            <p className="text-text-muted">
              {bookings.length > 0 ? "No bookings match your search criteria." : "There are currently no bookings in the system."}
            </p>
            {bookings.length > 0 && (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-lg text-primary">{booking.name}</h3>
                    <div className="text-xs text-text-muted mt-1">Booked on {new Date(booking.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      ID: #{booking.id}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(booking.status || 'Pending')}`}>
                      {booking.status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <span className="w-24 text-xs font-semibold text-gray-400 uppercase">Service:</span>
                    <span className="text-sm font-medium text-primary">{booking.service}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-24 text-xs font-semibold text-gray-400 uppercase">Vehicle:</span>
                    <span className="text-sm text-text-dark">{booking.car}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-24 text-xs font-semibold text-gray-400 uppercase">Schedule:</span>
                    <span className="text-sm text-text-dark">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-24 text-xs font-semibold text-gray-400 uppercase">Contact:</span>
                    <div className="flex flex-col text-sm text-text-dark">
                      <span>{booking.phone}</span>
                      <span className="text-gray-500">{booking.email}</span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">Customer Notes:</span>
                      <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50 text-sm text-gray-700 italic">
                        {booking.notes}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Admin Actions */}
                <div className="pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-3">Update Status:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'Pending')}
                      disabled={updatingId === booking.id || booking.status === 'Pending'}
                      className="text-xs font-medium py-2 px-1 rounded border border-gray-200 bg-white hover:bg-yellow-50 text-gray-600 hover:text-yellow-700 hover:border-yellow-200 disabled:opacity-50 transition-colors"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                      disabled={updatingId === booking.id || booking.status === 'Confirmed'}
                      className="text-xs font-medium py-2 px-1 rounded border border-gray-200 bg-white hover:bg-green-50 text-gray-600 hover:text-green-700 hover:border-green-200 disabled:opacity-50 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'Completed')}
                      disabled={updatingId === booking.id || booking.status === 'Completed'}
                      className="text-xs font-medium py-2 px-1 rounded border border-gray-200 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-700 hover:border-blue-200 disabled:opacity-50 transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}
                      disabled={updatingId === booking.id || booking.status === 'Cancelled'}
                      className="text-xs font-medium py-2 px-1 rounded border border-gray-200 bg-white hover:bg-red-50 text-gray-600 hover:text-red-700 hover:border-red-200 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
