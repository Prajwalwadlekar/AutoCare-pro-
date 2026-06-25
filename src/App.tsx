import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Menu, 
  X, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  CircleDashed, 
  Wind,
  Pointer,
  Calendar,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (currentView === 'home' && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentView]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const bookingData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      car: formData.get('car'),
      service: formData.get('service'),
      date: formData.get('date'),
      time: formData.get('time'),
      notes: formData.get('notes'),
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setBookingStatus('success');
      form.reset();
      
      setTimeout(() => {
        setBookingStatus('idle');
      }, 5000);
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
      
      setTimeout(() => {
        setBookingStatus('idle');
      }, 5000);
    }
  };

  const services = [
    { icon: Droplet, name: 'Oil Change', desc: 'Premium synthetic oil replacement and filter change.', price: 499 },
    { icon: Sparkles, name: 'Full Car Wash', desc: 'Exterior wash, interior vacuum, and dashboard polish.', price: 299 },
    { icon: ShieldCheck, name: 'Brake Inspection', desc: 'Complete check of brake pads, rotors, and fluid.', price: 399 },
    { icon: Wrench, name: 'Engine Tune-Up', desc: 'Spark plug replacement and complete engine diagnostics.', price: 1499 },
    { icon: CircleDashed, name: 'Tire Rotation', desc: 'Rotate and balance tires for even wear and longevity.', price: 599 },
    { icon: Wind, name: 'AC Repair', desc: 'AC gas refill, filter cleaning, and leak check.', price: 899 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-primary tracking-tight">AutoCare Pro</span>
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-4 md:gap-8">
              {/* Desktop Menu */}
              <div className="hidden xl:flex items-center gap-6">
                <a href="#home" onClick={() => setCurrentView('home')} className="text-text-dark hover:text-accent font-medium transition-colors">Home</a>
                <a href="#services" onClick={() => setCurrentView('home')} className="text-text-dark hover:text-accent font-medium transition-colors">Services</a>
                <a href="#how-it-works" onClick={() => setCurrentView('home')} className="text-text-dark hover:text-accent font-medium transition-colors">How It Works</a>
                <a href="#testimonials" onClick={() => setCurrentView('home')} className="text-text-dark hover:text-accent font-medium transition-colors">Testimonials</a>
                <a href="#faq" onClick={() => setCurrentView('home')} className="text-text-dark hover:text-accent font-medium transition-colors">FAQ</a>
                <a href="#contact" onClick={() => setCurrentView('home')} className="text-text-dark hover:text-accent font-medium transition-colors">Contact</a>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="text-text-dark hover:text-accent font-medium transition-colors flex items-center"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" /> My Bookings
                </button>
              </div>

              {/* Always Visible CTA */}
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => setCurrentView('admin')}
                  className="text-text-muted hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Admin Access"
                >
                  <ShieldAlert className="w-5 h-5" />
                </button>
                <a 
                  href="#book" 
                  onClick={() => setCurrentView('home')}
                  className="bg-accent hover:bg-accent-hover text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-sm md:text-base transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Book Now
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-text-dark hover:text-accent p-1"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a onClick={() => { setIsMobileMenuOpen(false); setCurrentView('home'); }} href="#home" className="block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md">Home</a>
              <a onClick={() => { setIsMobileMenuOpen(false); setCurrentView('home'); }} href="#services" className="block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md">Services</a>
              <a onClick={() => { setIsMobileMenuOpen(false); setCurrentView('home'); }} href="#how-it-works" className="block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md">How It Works</a>
              <a onClick={() => { setIsMobileMenuOpen(false); setCurrentView('home'); }} href="#testimonials" className="block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md">Testimonials</a>
              <a onClick={() => { setIsMobileMenuOpen(false); setCurrentView('home'); }} href="#faq" className="block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md">FAQ</a>
              <a onClick={() => { setIsMobileMenuOpen(false); setCurrentView('home'); }} href="#contact" className="block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md">Contact</a>
              <button onClick={() => { setIsMobileMenuOpen(false); setCurrentView('dashboard'); }} className="w-full text-left block px-3 py-3 text-base font-medium text-text-dark hover:text-accent hover:bg-light-bg rounded-md flex items-center">
                <LayoutDashboard className="w-5 h-5 mr-2" /> My Bookings
              </button>
            </div>
          </div>
        )}
      </nav>

      {currentView === 'dashboard' ? (
        <Dashboard onBack={() => setCurrentView('home')} />
      ) : currentView === 'admin' ? (
        <AdminPanel onBack={() => setCurrentView('home')} />
      ) : (
        <>
          {/* 2. HERO SECTION */}
          <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 bg-primary relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Your Car Deserves <br/>the <span className="text-accent">Best Care</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Fast, Reliable & Affordable Car Servicing – Book in Minutes. Experience premium auto care right at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="#book" 
                className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
              >
                Book a Service
              </a>
              <a 
                href="#services" 
                className="bg-transparent border-2 border-white/20 hover:border-white text-white px-8 py-4 rounded-full font-medium text-lg transition-all text-center"
              >
                View Services
              </a>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            {/* Stylized car representation */}
            <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 p-8 flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <Car className="w-48 h-48 text-white/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Premium Services</h2>
            <p className="text-text-muted text-lg">Top-quality auto care delivered by certified professionals using genuine parts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 bg-light-bg rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{service.name}</h3>
                <p className="text-text-muted mb-6">{service.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold text-lg text-text-dark">Starting <span className="text-accent">₹{service.price}</span></span>
                  <a href="#book" className="text-accent font-medium hover:text-primary transition-colors flex items-center gap-1">
                    Book Now <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-text-muted text-lg">Three simple steps to get your car running like new.</p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: 1, title: 'Choose Your Service', icon: Pointer, desc: 'Select from our wide range of premium car repair and maintenance services.' },
                { step: 2, title: 'Pick Date & Time', icon: Calendar, desc: 'Choose a convenient slot that fits your schedule perfectly.' },
                { step: 3, title: 'Confirm & Relax', icon: CheckCircle, desc: 'Drop your car off or choose pickup. We handle the rest with care.' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-2xl">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                    <item.icon className="w-8 h-8" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold border-4 border-white">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOOKING FORM SECTION */}
      <section id="book" className="py-20 bg-primary relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Book Your Service</h2>
              <p className="text-text-muted">Fill out the form below and we'll confirm your appointment.</p>
            </div>

            {bookingStatus === 'success' && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <p className="font-medium">✅ Booking Confirmed! We'll contact you shortly with further details.</p>
              </div>
            )}
            
            {bookingStatus === 'error' && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                <p className="font-medium">❌ Failed to submit booking. Please try again later.</p>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-text-dark">Full Name *</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-text-dark">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark">Email Address *</label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="car" className="block text-sm font-medium text-text-dark">Car Make & Model *</label>
                  <input type="text" id="car" name="car" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50" placeholder="e.g. Honda City 2022" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="service" className="block text-sm font-medium text-text-dark">Select Service *</label>
                  <select id="service" name="service" required defaultValue="" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50 appearance-none">
                    <option value="" disabled>Choose a service</option>
                    {services.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-text-dark">Preferred Date *</label>
                    <input type="date" id="date" name="date" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="time" className="block text-sm font-medium text-text-dark">Time Slot *</label>
                    <select id="time" name="time" required defaultValue="" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50 appearance-none">
                      <option value="" disabled>Select</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium text-text-dark">Additional Notes (Optional)</label>
                <textarea id="notes" name="notes" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-light-bg/50 resize-none" placeholder="Any specific issues you want us to look at?"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={bookingStatus === 'loading'}
                className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {bookingStatus === 'loading' ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Our Customers Say</h2>
            <p className="text-text-muted text-lg">Don't just take our word for it. Here's what car owners have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rahul M.', quote: 'Excellent service! The pickup and drop facility made it so convenient. My Honda City feels brand new.' },
              { name: 'Priya S.', quote: 'Very professional team. They explained everything clearly before starting the work. Highly transparent pricing.' },
              { name: 'Amit K.', quote: 'Got my AC repaired here. Fast turnaround and the cooling is better than ever. Will definitely come back.' }
            ].map((review, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-text-dark mb-6 italic">"{review.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">{review.name.charAt(0)}</span>
                  </div>
                  <span className="font-bold text-primary">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-text-muted text-lg">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Do you use genuine spare parts?', a: 'Yes, we strictly use OEM (Original Equipment Manufacturer) and OES (Original Equipment Supplier) parts for all replacements to ensure your car\'s longevity and performance.' },
              { q: 'How long does a standard service take?', a: 'A standard comprehensive service usually takes between 3 to 4 hours. However, major repairs might require more time. We will provide an estimated time when you drop off your car.' },
              { q: 'Do you offer pick-up and drop-off services?', a: 'Yes! We offer free pick-up and drop-off within a 10km radius of our service center for your convenience.' },
              { q: 'Is there a warranty on repairs?', a: 'Absolutely. We provide a 6-month or 5,000 km warranty (whichever comes first) on all our repairs and parts replaced.' }
            ].map((faq, i) => (
              <div key={i} className="bg-light-bg rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-2 flex items-start gap-3">
                  <span className="text-accent font-black">Q.</span> {faq.q}
                </h3>
                <p className="text-text-muted pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT / FOOTER SECTION */}
      <footer id="contact" className="bg-primary text-white pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Left Side: Contact Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Car className="w-6 h-6 text-accent" />
                </div>
                <span className="font-heading font-bold text-2xl tracking-tight">AutoCare Pro</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-sm">
                Your trusted partner for comprehensive car servicing and maintenance. We keep you safely on the road.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-gray-300">123 MG Road, Pune,<br/>Maharashtra 411001</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-gray-300">support@autocarepro.in</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-gray-300">Mon–Sat, 8 AM – 7 PM</span>
                </div>
              </div>
            </div>

            {/* Right Side: Quick Links */}
            <div className="md:pl-12">
              <h3 className="text-xl font-bold mb-6 font-heading">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#book" className="text-gray-400 hover:text-white transition-colors">Book Now</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 AutoCare Pro. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent cursor-pointer transition-colors">
                <span className="text-sm font-bold">FB</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent cursor-pointer transition-colors">
                <span className="text-sm font-bold">IG</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent cursor-pointer transition-colors">
                <span className="text-sm font-bold">TW</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}
