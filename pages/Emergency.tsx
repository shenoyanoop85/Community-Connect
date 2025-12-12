import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, Shield, Phone, ChevronRight, MapPin, Share2, Flame, Activity, HelpCircle, Plus, X, Trash2, CheckCircle, AlertTriangle, Loader2, UserPlus, Contact as ContactIcon, Stethoscope, Wrench, Truck, Briefcase } from 'lucide-react';
import { CURRENT_USER } from '../constants';

const EmergencyTile = ({ icon, label, color, bg, onClick }: any) => (
    <div onClick={onClick} className={`h-36 ${bg} rounded-[28px] flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform cursor-pointer shadow-sm border border-transparent hover:border-black/5`}>
        <div className={`p-4 bg-white rounded-full shadow-sm ${color}`}>{icon}</div>
        <span className="font-bold text-gray-800">{label}</span>
    </div>
);

interface Contact {
    id: number;
    name: string;
    phone: string;
    image: string;
}

interface ServiceContact {
    id: number;
    name: string;
    role: string; // e.g., Plumber, Electrician
    phone: string;
    category: 'Medical' | 'Fire' | 'Security' | 'Maintenance' | 'Other';
}

export const Emergency = () => {
    const navigate = useNavigate();
    const isAdmin = CURRENT_USER.role === 'Admin';
    
    // --- Geolocation State ---
    const [location, setLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
    const [locLoading, setLocLoading] = useState(true);

    // --- Slider State ---
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderX, setSliderX] = useState(0);
    const [isCalling, setIsCalling] = useState(false);

    // --- Alert State ---
    const [alertState, setAlertState] = useState<{ show: boolean, type: string | null, status: 'confirm' | 'sending' | 'success' }>({
        show: false, type: null, status: 'confirm'
    });

    // --- Personal Contacts State ---
    const [contacts, setContacts] = useState<Contact[]>([
        { id: 1, name: 'Dad', phone: '+919876543210', image: 'https://picsum.photos/seed/dad/100/100' },
        { id: 2, name: 'Security', phone: '080-12345678', image: 'https://picsum.photos/seed/sec/100/100' }
    ]);
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [isManagingContacts, setIsManagingContacts] = useState(false);

    // --- Community Services State ---
    const [serviceContacts, setServiceContacts] = useState<ServiceContact[]>([
        { id: 101, name: 'City Hospital', role: 'Ambulance', phone: '1066', category: 'Medical' },
        { id: 102, name: 'Fire Station', role: 'Emergency', phone: '101', category: 'Fire' },
        { id: 103, name: 'Raju Electricals', role: 'Electrician', phone: '+91 99887 76655', category: 'Maintenance' },
        { id: 104, name: 'Quick Fix Plumbing', role: 'Plumber', phone: '+91 99887 11223', category: 'Maintenance' },
    ]);
    const [showAddService, setShowAddService] = useState(false);
    const [newServiceName, setNewServiceName] = useState('');
    const [newServiceRole, setNewServiceRole] = useState('');
    const [newServicePhone, setNewServicePhone] = useState('');
    const [newServiceCategory, setNewServiceCategory] = useState<'Medical' | 'Fire' | 'Security' | 'Maintenance' | 'Other'>('Maintenance');

    const primaryContact = contacts.length > 0 ? contacts[0] : null;

    // --- Effects ---

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    let resolvedAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    
                    // Attempt Reverse Geocoding via OpenStreetMap (No API Key required)
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                        const data = await response.json();
                        if (data && data.display_name) {
                            // Simplify the address to make it readable
                            // e.g., "123 Main St, Springfield, IL"
                            const parts = data.display_name.split(',');
                            resolvedAddress = parts.slice(0, 3).join(', ');
                        }
                    } catch (error) {
                        console.warn("Reverse geocoding failed, using coordinates.", error);
                    }

                    setLocation({
                        lat,
                        lng,
                        address: resolvedAddress
                    });
                    setLocLoading(false);
                },
                (err) => {
                    console.error(err);
                    setLocLoading(false);
                    setLocation({ lat: 0, lng: 0, address: "Location Unavailable" });
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocLoading(false);
        }
    }, []);

    // --- Handlers ---

    // Slider Logic
    const handleTouchMove = (e: React.TouchEvent) => {
        if (isCalling || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const touchX = e.touches[0].clientX;
        const offsetX = touchX - rect.left - 28; // 28 is half thumb size approx
        const maxDrag = rect.width - 64; // width minus thumb width + padding

        const newX = Math.max(0, Math.min(offsetX, maxDrag));
        setSliderX(newX);

        if (newX >= maxDrag - 5) {
            triggerCall();
        }
    };

    const handleTouchEnd = () => {
        if (isCalling || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const maxDrag = rect.width - 64;
        
        if (sliderX < maxDrag - 5) {
            setSliderX(0); // Snap back
        }
    };

    const triggerCall = () => {
        setIsCalling(true);
        setSliderX(sliderRef.current ? sliderRef.current.clientWidth - 64 : 250);
        
        const numberToCall = primaryContact ? primaryContact.phone : '112'; // Fallback to India's 112 if no contacts

        // Simulate call delay
        setTimeout(() => {
            window.location.href = `tel:${numberToCall}`;
            setIsCalling(false);
            setSliderX(0);
        }, 1000);
    };

    const handleShareLocation = async () => {
        if (!location) return;

        // Create a universal Google Maps link
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
        
        const shareData = {
            title: '🚨 Emergency Alert',
            text: `I need help immediately!\n\n📍 My Location: ${location.address}\n\nClick to view on map: ${mapLink}`,
            url: mapLink // Some apps ignore this and just use text, so we put the link in text too.
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.text}`);
                alert("Location link copied to clipboard!");
            } catch (err) {
                alert("Sharing not supported on this device.");
            }
        }
    };

    // Alert Logic
    const handleTileClick = (type: string) => {
        setAlertState({ show: true, type, status: 'confirm' });
    };

    const confirmAlert = () => {
        setAlertState(prev => ({ ...prev, status: 'sending' }));
        setTimeout(() => {
            setAlertState(prev => ({ ...prev, status: 'success' }));
        }, 2000);
    };

    const closeAlert = () => {
        setAlertState({ show: false, type: null, status: 'confirm' });
    };

    // Contact Logic
    const handleAddClick = async () => {
        if (contacts.length >= 5) {
            alert("Maximum 5 contacts allowed. Please remove one to add another.");
            return;
        }

        // Simplify detection: strictly check navigator.contacts
        // The previous check `&& 'ContactsManager' in window` might fail on some valid implementations
        const isSupported = 'contacts' in navigator;

        if (isSupported) {
            try {
                const props = ['name', 'tel'];
                const opts = { multiple: false };
                // @ts-ignore
                const selectedContacts = await navigator.contacts.select(props, opts);
                
                if (selectedContacts.length > 0) {
                    const contact = selectedContacts[0];
                    const name = contact.name?.[0] || 'Unknown';
                    const phone = contact.tel?.[0] || '';
                    
                    if (phone) {
                        const newContact: Contact = {
                            id: Date.now(),
                            name: name,
                            phone: phone,
                            image: `https://picsum.photos/seed/${Date.now()}/100/100`
                        };
                        setContacts([...contacts, newContact]);
                    }
                }
            } catch (ex) {
                // If the user simply cancels, we might not want to fallback to manual immediately
                // But for now, if an error occurs (like NotAllowedError), we fallback.
                console.warn("Contact picker failed or cancelled", ex);
                setShowAddContact(true);
            }
        } else {
            // Fallback for browsers without Contact Picker API (iOS/Desktop)
            setShowAddContact(true);
        }
    };

    const handleSaveManualContact = () => {
        if (!newContactName || !newContactPhone) return;
        const newContact: Contact = {
            id: Date.now(),
            name: newContactName,
            phone: newContactPhone,
            image: `https://picsum.photos/seed/${Date.now()}/100/100`
        };
        setContacts([...contacts, newContact]);
        setNewContactName('');
        setNewContactPhone('');
        setShowAddContact(false);
    };

    const handleDeleteContact = (id: number) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const handleContactClick = (contact: Contact) => {
        if (isManagingContacts) {
            // Move selected contact to index 0 (Primary)
            const newContacts = contacts.filter(c => c.id !== contact.id);
            newContacts.unshift(contact);
            setContacts(newContacts);
        } else {
             window.location.href = `tel:${contact.phone}`;
        }
    };

    // Service Contact Logic (Admin Only)
    const handleAddService = () => {
        if (!newServiceName || !newServicePhone || !newServiceRole) return;
        const newService: ServiceContact = {
            id: Date.now(),
            name: newServiceName,
            role: newServiceRole,
            phone: newServicePhone,
            category: newServiceCategory
        };
        setServiceContacts([...serviceContacts, newService]);
        setShowAddService(false);
        setNewServiceName('');
        setNewServiceRole('');
        setNewServicePhone('');
    };

    const handleDeleteService = (id: number) => {
        if (window.confirm("Are you sure you want to delete this service contact?")) {
            setServiceContacts(serviceContacts.filter(s => s.id !== id));
        }
    };

    const getServiceIcon = (category: string) => {
        switch(category) {
            case 'Medical': return <Stethoscope size={20} />;
            case 'Fire': return <Flame size={20} />;
            case 'Security': return <Shield size={20} />;
            case 'Maintenance': return <Wrench size={20} />;
            default: return <Briefcase size={20} />;
        }
    };

    const getServiceColor = (category: string) => {
        switch(category) {
            case 'Medical': return 'bg-blue-100 text-blue-600';
            case 'Fire': return 'bg-orange-100 text-orange-600';
            case 'Security': return 'bg-purple-100 text-purple-600';
            case 'Maintenance': return 'bg-slate-100 text-slate-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-y-auto no-scrollbar pb-24">
            
            {/* --- TOP SECTION --- */}
            <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white pt-12 pb-12 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden shrink-0 z-10">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"><ChevronLeft /></button>
                    <h1 className="font-bold tracking-widest text-sm opacity-80">EMERGENCY</h1>
                    <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"><Settings size={18} /></button>
                </div>

                <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Shield className="text-red-500 fill-red-500" size={32} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Do you need help?</h2>
                    <p className="text-white/80 text-sm max-w-xs leading-relaxed">
                        {primaryContact 
                            ? `Swipe to call ${primaryContact.name} immediately.` 
                            : 'Swipe to call Emergency (112).'}
                    </p>
                </div>

                {/* --- SLIDER --- */}
                <div 
                    ref={sliderRef}
                    className="mt-10 mx-auto max-w-sm bg-white rounded-full p-2 shadow-2xl relative h-16 flex items-center overflow-hidden touch-none"
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-red-500 font-bold text-lg tracking-wide transition-opacity duration-300 ${sliderX > 50 ? 'opacity-20' : 'opacity-100'}`}>
                            {isCalling ? 'DIALING...' : 'SLIDE TO CALL HELP'}
                        </span>
                        {!isCalling && (
                            <div className="absolute right-4 flex animate-pulse">
                                <ChevronRight className="text-gray-300" />
                                <ChevronRight className="text-gray-300 -ml-2" />
                            </div>
                        )}
                    </div>
                    
                    <div 
                        className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md absolute z-10 transition-transform duration-75 ease-out"
                        style={{ transform: `translateX(${sliderX}px)` }}
                    >
                        {isCalling ? <Loader2 className="text-white animate-spin" /> : <Phone className="text-white" />}
                    </div>
                </div>
            </div>

            {/* --- LOCATION --- */}
            <div className="px-6 -mt-6 relative z-10 mb-6 shrink-0">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-50 flex flex-col gap-3">
                     <div className="h-24 bg-gray-200 rounded-xl w-full relative overflow-hidden">
                         {/* Static Map Image using Coordinates if available */}
                        <img 
                            src={`https://picsum.photos/seed/${location ? location.lat : 'map'}/600/200`} 
                            className="w-full h-full object-cover opacity-60 grayscale" 
                            alt="map" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {locLoading ? (
                                <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
                                    <Loader2 size={12} className="animate-spin" /> Locating...
                                </span>
                            ) : (
                                <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-in fade-in zoom-in">
                                    <MapPin size={12} /> {location ? 'Live Location Active' : 'Location Off'}
                                </span>
                            )}
                        </div>
                     </div>
                     <div className="flex justify-between items-center px-2">
                        <div className="flex-1 mr-2">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Current Location</p>
                            <p className="font-bold text-gray-800 text-sm font-mono leading-tight break-words">
                                {location ? location.address : 'Waiting for GPS...'}
                            </p>
                        </div>
                        <button 
                            onClick={handleShareLocation}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex-shrink-0"
                            title="Share Location"
                        >
                            <Share2 size={18} />
                        </button>
                     </div>
                </div>
            </div>

            {/* --- CATEGORIES --- */}
            <div className="px-6 shrink-0 mb-8">
                <div className="flex justify-between items-end mb-4">
                     <h3 className="font-bold text-lg text-gray-800">Raise Alert</h3>
                     <span className="text-xs text-gray-400">Tap to notify admin</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <EmergencyTile onClick={() => handleTileClick('Fire')} icon={<Flame size={28} />} label="Fire" color="text-orange-500" bg="bg-orange-50" />
                    <EmergencyTile onClick={() => handleTileClick('Medical')} icon={<Activity size={28} />} label="Medical" color="text-blue-500" bg="bg-blue-50" />
                    <EmergencyTile onClick={() => handleTileClick('Security')} icon={<Shield size={28} />} label="Security" color="text-purple-500" bg="bg-purple-50" />
                    <EmergencyTile onClick={() => handleTileClick('Other')} icon={<HelpCircle size={28} />} label="Other" color="text-gray-600" bg="bg-gray-100" />
                </div>
            </div>
            
            {/* --- PERSONAL CONTACTS --- */}
            <div className="px-6 shrink-0 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800">My Contacts <span className="text-gray-400 text-xs font-normal">({contacts.length}/5)</span></h3>
                        {isManagingContacts && <p className="text-[10px] text-blue-500 font-medium animate-pulse mt-1">Tap a contact to set as Primary</p>}
                    </div>
                    <button 
                        onClick={() => setIsManagingContacts(!isManagingContacts)} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isManagingContacts ? 'bg-blue-600 text-white shadow-md' : 'text-blue-500 bg-blue-50'}`}
                    >
                        {isManagingContacts ? 'Done' : 'Manage'}
                    </button>
                </div>
                
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 px-2">
                    {/* Add Button */}
                    <div className={`flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer transition-opacity ${contacts.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleAddClick}>
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors bg-white">
                            <Plus size={24} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Add New</span>
                    </div>

                    {contacts.map((contact, index) => {
                         const isPrimary = index === 0;
                         return (
                            <div key={contact.id} className="flex flex-col items-center gap-2 flex-shrink-0 relative group w-16" onClick={() => handleContactClick(contact)}>
                                <div className="relative">
                                    <img 
                                        src={contact.image} 
                                        className={`w-16 h-16 rounded-full object-cover shadow-sm transition-all duration-300 ${isPrimary ? 'border-4 border-red-500' : 'border-2 border-gray-100'} ${isManagingContacts && !isPrimary ? 'opacity-60 hover:opacity-100' : ''}`} 
                                        alt={contact.name} 
                                    />
                                    
                                    {isManagingContacts && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id); }}
                                            className="absolute -top-1 -right-2 w-7 h-7 bg-white text-red-500 border border-gray-100 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-red-50"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}

                                    {!isManagingContacts && (
                                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                                            <Phone size={10} className="text-white fill-white" />
                                        </div>
                                    )}

                                    {isPrimary && (
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border-2 border-white shadow-sm z-10">
                                            PRIMARY
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs font-medium text-center truncate w-full mt-1 ${isPrimary ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                    {contact.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- COMMUNITY DIRECTORY (NEW SECTION) --- */}
            <div className="px-6 pb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800">Community Directory</h3>
                        <p className="text-xs text-gray-400">Important numbers & services</p>
                    </div>
                    {isAdmin && (
                         <button 
                            onClick={() => setShowAddService(true)} 
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow-md flex items-center gap-1 hover:bg-black transition-colors"
                        >
                            <Plus size={14} /> Add Service
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {serviceContacts.map(service => (
                        <div key={service.id} className="flex items-center p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${getServiceColor(service.category)}`}>
                                {getServiceIcon(service.category)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">{service.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{service.role}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{service.category}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a 
                                    href={`tel:${service.phone}`}
                                    className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
                                >
                                    <Phone size={18} />
                                </a>
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDeleteService(service.id)}
                                        className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ALERT MODAL --- */}
            {alertState.show && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[32px] w-full max-w-sm p-6 text-center shadow-2xl animate-in zoom-in-95">
                        {alertState.status === 'confirm' && (
                            <>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                    <AlertTriangle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Alert?</h3>
                                <p className="text-gray-500 text-sm mb-8">
                                    This will notify community security and admins about a <strong className="text-gray-800">{alertState.type}</strong> emergency at your location.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={closeAlert} className="flex-1 py-3 bg-gray-100 font-bold text-gray-700 rounded-xl">Cancel</button>
                                    <button onClick={confirmAlert} className="flex-1 py-3 bg-red-500 font-bold text-white rounded-xl shadow-lg shadow-red-200">Yes, Alert</button>
                                </div>
                            </>
                        )}
                        {alertState.status === 'sending' && (
                            <div className="py-10">
                                <Loader2 size={48} className="animate-spin text-red-500 mx-auto mb-4" />
                                <p className="font-bold text-gray-800">Notifying Security...</p>
                            </div>
                        )}
                        {alertState.status === 'success' && (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Alert Sent</h3>
                                <p className="text-gray-500 text-sm mb-8">
                                    Help is on the way. Please stay calm and wait for assistance.
                                </p>
                                <button onClick={closeAlert} className="w-full py-3 bg-gray-900 font-bold text-white rounded-xl">Close</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* --- ADD CONTACT MODAL (Manual Fallback) --- */}
            {showAddContact && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add Contact</h3>
                            <button onClick={() => setShowAddContact(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Name</label>
                                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <UserPlus size={18} className="text-gray-400 mr-3" />
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Dad" 
                                        className="bg-transparent w-full outline-none text-gray-800 font-medium"
                                        value={newContactName}
                                        onChange={(e) => setNewContactName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <Phone size={18} className="text-gray-400 mr-3" />
                                    <input 
                                        type="tel" 
                                        placeholder="e.g. +91 98765 43210" 
                                        className="bg-transparent w-full outline-none text-gray-800 font-medium"
                                        value={newContactPhone}
                                        onChange={(e) => setNewContactPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveManualContact}
                            disabled={!newContactName || !newContactPhone}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                                newContactName && newContactPhone ? 'bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            Save Contact
                        </button>
                    </div>
                </div>
            )}

            {/* --- ADD SERVICE MODAL (Admin Only) --- */}
            {showAddService && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add Service Contact</h3>
                            <button onClick={() => setShowAddService(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Service Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. City General Hospital" 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:border-blue-500 transition-colors"
                                    value={newServiceName}
                                    onChange={(e) => setNewServiceName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Role / Tag</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Ambulance" 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:border-blue-500 transition-colors"
                                        value={newServiceRole}
                                        onChange={(e) => setNewServiceRole(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</label>
                                    <select 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:border-blue-500 transition-colors appearance-none"
                                        value={newServiceCategory}
                                        onChange={(e) => setNewServiceCategory(e.target.value as any)}
                                    >
                                        <option value="Medical">Medical</option>
                                        <option value="Fire">Fire</option>
                                        <option value="Security">Security</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. 108" 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium outline-none focus:border-blue-500 transition-colors"
                                    value={newServicePhone}
                                    onChange={(e) => setNewServicePhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleAddService}
                            disabled={!newServiceName || !newServicePhone || !newServiceRole}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                                newServiceName && newServicePhone ? 'bg-slate-900 shadow-lg hover:bg-black' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            Add to Directory
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}