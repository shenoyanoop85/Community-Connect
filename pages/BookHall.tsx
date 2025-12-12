
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Activity, Settings, FileText, ChevronRight, ArrowRight, Calendar as CalendarIcon, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { HALL_DETAILS, BOOKINGS, CURRENT_USER } from '../constants';
import { Booking } from '../types';

export const BookHall = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'book' | 'my-bookings'>('book');
    
    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStart, setSelectedStart] = useState<Date | null>(null);
    const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Booking Logic State
    const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // --- Helpers ---

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const formatDateStr = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isDateBooked = (date: Date) => {
        const dateStr = formatDateStr(date);
        return bookings.find(b => {
            return dateStr >= b.startDate && dateStr <= b.endDate && b.status !== 'Rejected';
        });
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // New Validation: One booking per month per apartment (User)
    const hasBookingInMonth = (date: Date) => {
        const m = date.getMonth();
        const y = date.getFullYear();
        
        return bookings.some(b => {
            // Check if booking belongs to current user (address proxy)
            if (b.userId !== CURRENT_USER.id) return false; 
            if (b.status === 'Rejected') return false;

            // Parse booking start date
            const bDate = new Date(b.startDate);
            return bDate.getMonth() === m && bDate.getFullYear() === y;
        });
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const clickedDateStr = formatDateStr(clickedDate);
        const todayStr = formatDateStr(new Date());

        // 1. Prevent selecting past dates
        if (clickedDateStr < todayStr) return;

        // 2. Prevent selecting booked dates
        if (isDateBooked(clickedDate)) return;

        setError(null);

        // 3. Selection Logic
        if (!selectedStart || (selectedStart && selectedEnd)) {
            // Start a new selection
            
            // Validate Monthly Limit before starting new selection
            if (CURRENT_USER.role === 'Resident' && hasBookingInMonth(clickedDate)) {
                 setError("Apartment quota exceeded: One booking per month allowed.");
                 return;
            }

            setSelectedStart(clickedDate);
            setSelectedEnd(null);
        } else {
            // End date selection
            let start = selectedStart;
            let end = clickedDate;

            if (end < start) {
                [start, end] = [end, start];
            }

            // 4. Validate Range
            const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            // Check for existing bookings inside the range
            let hasOverlap = false;
            let checkDate = new Date(start);
            while (checkDate <= end) {
                if (isDateBooked(checkDate)) {
                    hasOverlap = true;
                    break;
                }
                checkDate.setDate(checkDate.getDate() + 1);
            }

            if (hasOverlap) {
                setError("Selected range includes already booked dates.");
                setSelectedStart(clickedDate);
                setSelectedEnd(null);
                return;
            }

            // Check Role Constraints (Max 2 Days)
            if (CURRENT_USER.role === 'Resident' && dayDiff > 2) {
                setError("Residents can book a maximum of 2 consecutive days.");
                setSelectedStart(clickedDate); // Reset to just the clicked day
                return;
            }

            // Check if the range spans into a month where user already has a booking
            // (Simplified: Just check the start month for now, or check both if spanning months)
            if (CURRENT_USER.role === 'Resident' && hasBookingInMonth(end) && end.getMonth() !== start.getMonth()) {
                 setError("Apartment quota exceeded for the target month.");
                 setSelectedStart(clickedDate);
                 return;
            }

            setSelectedStart(start);
            setSelectedEnd(end);
        }
    };

    const handleBookNow = () => {
        if (!selectedStart) return;
        
        const start = selectedStart;
        const end = selectedEnd || selectedStart;
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const totalAmount = days * HALL_DETAILS.pricePerDay;

        const newBooking: Booking = {
            id: `b${Date.now()}`,
            userId: CURRENT_USER.id,
            hallId: HALL_DETAILS.id,
            startDate: formatDateStr(start),
            endDate: formatDateStr(end),
            status: 'Pending', // All requests start as pending
            totalAmount: totalAmount,
            purpose: 'Community Event'
        };

        setBookings([...bookings, newBooking]);
        setShowConfirmation(true);
        setSelectedStart(null);
        setSelectedEnd(null);
    };

    // --- Renderers ---

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] p-5">
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-900 text-lg">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S','M','T','W','T','F','S'].map(d => (
                        <span key={d} className="text-gray-400 text-xs font-bold py-2">{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                    {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                    {days.map(day => {
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dateStr = formatDateStr(date);
                        const todayStr = formatDateStr(new Date());
                        const booking = isDateBooked(date);
                        
                        let dayClass = "text-gray-700 hover:bg-gray-100"; // Default
                        let isSelected = false;

                        // Past Dates
                        if (dateStr < todayStr) {
                            dayClass = "text-gray-300 cursor-not-allowed";
                        } 
                        // Booked Dates
                        else if (booking) {
                            if (booking.status === 'Approved') dayClass = "bg-red-50 text-red-400 font-medium cursor-not-allowed";
                            if (booking.status === 'Pending') dayClass = "bg-orange-50 text-orange-400 font-medium cursor-not-allowed";
                        }
                        // Selected Dates
                        else {
                            if (selectedStart) {
                                const startStr = formatDateStr(selectedStart);
                                if (dateStr === startStr) isSelected = true;
                                
                                if (selectedEnd) {
                                    const endStr = formatDateStr(selectedEnd);
                                    if (dateStr === endStr) isSelected = true;
                                    if (date > selectedStart && date < selectedEnd) isSelected = true;
                                }
                            }
                        }

                        if (isSelected) {
                            dayClass = "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10";
                        }

                        return (
                            <div 
                                key={day} 
                                onClick={() => handleDateClick(day)}
                                className={`h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all duration-200 ${dayClass} cursor-pointer relative`}
                            >
                                {day}
                                {/* Dot indicator for bookings */}
                                {booking && !isSelected && (
                                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${booking.status === 'Approved' ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Your Pick</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Booked</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Pending</div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium animate-pulse">
                        <AlertTriangle size={14} /> {error}
                    </div>
                )}
            </div>
        );
    };

    const renderMyBookings = () => {
        const myBookings = bookings.filter(b => b.userId === CURRENT_USER.id).sort((a,b) => b.startDate.localeCompare(a.startDate));

        return (
            <div className="space-y-4 pt-2 pb-24">
                {myBookings.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No booking history found.</p>
                    </div>
                ) : (
                    myBookings.map(booking => (
                        <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900">{booking.purpose}</h3>
                                    <p className="text-xs text-gray-500 mt-1">ID: #{booking.id.slice(-4)}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                    booking.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                    booking.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <CalendarIcon size={14} className="text-blue-500" />
                                    <span className="font-bold">{booking.startDate}</span>
                                    {booking.startDate !== booking.endDate && (
                                        <>
                                            <ArrowRight size={12} className="text-gray-400" />
                                            <span className="font-bold">{booking.endDate}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                <span className="text-xs text-gray-400 font-medium">Total Paid</span>
                                <span className="text-lg font-bold text-gray-900">${booking.totalAmount.toLocaleString()}</span>
                            </div>
                            {booking.status === 'Pending' && (
                                <div className="mt-3 text-[10px] text-orange-500 bg-orange-50 p-2 rounded-lg flex items-center gap-2">
                                    <Clock size={12} /> Awaiting approval from Admin
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        );
    };

    // --- Calculation for Footer ---
    const getSelectionDetails = () => {
        if (!selectedStart) return { days: 0, total: 0 };
        const start = selectedStart;
        const end = selectedEnd || selectedStart;
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return {
            days,
            total: days * HALL_DETAILS.pricePerDay
        };
    };

    const selectionDetails = getSelectionDetails();

    return (
        <div className="min-h-screen bg-white pb-24">
             {/* Header Image */}
             <div className="h-[40vh] relative">
                <img src={HALL_DETAILS.image} className="w-full h-full object-cover" alt="hall" />
                <button onClick={() => navigate(-1)} className="absolute top-12 left-6 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 z-20"><ChevronLeft /></button>
             </div>
             
             {/* Main Content Card */}
             <div className="px-6 pt-8 -mt-8 bg-white rounded-t-[32px] relative z-10 min-h-[60vh]">
                {/* Details Section */}
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{HALL_DETAILS.name}</h1>
                    <div className="text-right">
                        <p className="text-blue-600 font-bold text-xl">${HALL_DETAILS.pricePerDay}</p>
                        <p className="text-xs text-gray-400">per day</p>
                    </div>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" /> {HALL_DETAILS.address}
                </div>

                <div className="flex gap-2 mb-6">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1">{HALL_DETAILS.rating} ★</span>
                    <span className="text-xs text-gray-400 underline py-1">{HALL_DETAILS.reviews} reviews</span>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-2">About this hall</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{HALL_DETAILS.description}</p>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4">Amenities</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                        {HALL_DETAILS.amenities.map(a => (
                            <div key={a} className="flex flex-col items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 text-gray-600 gap-2">
                                <div className="text-blue-500">
                                    {a.includes('Wifi') ? <Activity /> : a.includes('Cooling') ? <Settings /> : <FileText />}
                                </div>
                                <span className="text-[10px] font-bold">{a}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Control Section */}
                <div className="mb-24">
                     {/* Tabs */}
                    <div className="flex p-1 mb-6 bg-gray-100 rounded-xl">
                        <button 
                            onClick={() => setView('book')} 
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${view === 'book' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                        >
                            Select Date
                        </button>
                        <button 
                            onClick={() => setView('my-bookings')} 
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${view === 'my-bookings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                        >
                            My Requests
                        </button>
                    </div>

                    {view === 'book' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {renderCalendar()}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {renderMyBookings()}
                        </div>
                    )}
                </div>
             </div>

             {/* Sticky Footer */}
             {view === 'book' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex items-center justify-between z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Total Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                            ${selectionDetails.total.toLocaleString()}
                            <span className="text-sm text-gray-400 font-normal"> for {selectionDetails.days} days</span>
                        </p>
                    </div>
                    <button 
                        onClick={handleBookNow}
                        disabled={!selectedStart || !!error}
                        className={`px-8 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 ${
                            !selectedStart || !!error 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-blue-600 text-white shadow-blue-200'
                        }`}
                    >
                        Book Now <ArrowRight size={18} />
                    </button>
                </div>
             )}

             {/* Success Modal */}
             {showConfirmation && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                     <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Your booking request for <span className="font-bold text-gray-800">{selectionDetails.days} days</span> has been submitted. 
                            Wait for admin approval.
                        </p>
                        <button 
                            onClick={() => {
                                setShowConfirmation(false);
                                setView('my-bookings');
                            }}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-colors"
                        >
                            View Status
                        </button>
                     </div>
                 </div>
             )}
        </div>
    )
}
