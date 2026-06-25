import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Phone, Mail, FileText, Loader2, ArrowLeft, Search, Filter } from 'lucide-react';

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

export function Dashboard({ onBack }: { onBack: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
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

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      
      if (!response.ok) throw new Error('Failed to update booking');
      
      // Update local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.service.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center text-accent hover:text-accent-hover font-medium mb-4 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading">Bookings Dashboard</h1>
            <p className="text-text-muted mt-2">Manage and track your service appointments.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none appearance-none bg-white w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
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
              {bookings.length > 0 ? "No bookings match your search criteria." : "You haven't made any service bookings yet."}
            </p>
            {bookings.length > 0 && (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="mt-4 text-accent font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-primary">{booking.name}</h3>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {booking.service}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(booking.status || 'Pending')}`}>
                      {booking.status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center text-sm text-text-muted">
                    <Car className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{booking.car}</span>
                  </div>
                  <div className="flex items-center text-sm text-text-muted">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-sm text-text-muted">
                    <Clock className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="capitalize">{booking.time}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                    {booking.phone}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                    <span className="truncate">{booking.email}</span>
                  </div>
                  {booking.notes && (
                    <div className="flex items-start text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                      <FileText className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="italic line-clamp-2" title={booking.notes}>"{booking.notes}"</span>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="pt-2">
                  {(booking.status === 'Pending' || !booking.status) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={updatingId === booking.id}
                      className="w-full text-center text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {updatingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
