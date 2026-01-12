const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '12_homepage_optimized.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace Script Reference
content = content.replace(
    '<script src="custom_packages_form_v6.js"></script>',
    '<script src="homepage_logic_integrated.js"></script>'
);

// 2. Prepare New Forms HTML
const newFormsHTML = `
                    <!-- Packages Form -->
                    <div class="search-form block" id="packages-form">
                        <!-- Main Inputs Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end mb-4">
                            <!-- Origin -->
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0">
                                <i data-lucide="plane-takeoff" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">From</label>
                                    <input type="text" id="pkg-origin" data-type="airport_code" placeholder="Origin City" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                </div>
                            </div>
                            <!-- Destination -->
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0">
                                <i data-lucide="map-pin" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">To</label>
                                    <input type="text" id="pkg-dest" data-type="airport_code" placeholder="Destination" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                </div>
                            </div>
                            <!-- Dates -->
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0">
                                <i data-lucide="calendar-days" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Dates</label>
                                    <input type="text" id="pkg-dates" placeholder="Departure - Return" class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                </div>
                            </div>
                            <!-- Travellers -->
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0 cursor-pointer" id="pkg-traveler-trigger">
                                <i data-lucide="users" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Travellers</label>
                                    <input type="text" id="pkg-traveler-summary" placeholder="2 Travellers, 1 Room" readonly class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light cursor-pointer">
                                </div>
                                <!-- Popover -->
                                <div id="pkg-traveler-popover" class="absolute top-[120%] left-0 w-[320px] bg-white rounded-xl shadow-elegant-xl p-5 hidden z-[60] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 cursor-default">
                                    <div id="pkg-rooms-container" class="max-h-[300px] overflow-y-auto mb-4 custom-scrollbar"></div>
                                    <button type="button" id="pkg-btn-add-room" class="text-brand-coral font-bold text-sm mb-4 hover:underline flex items-center gap-1"><i data-lucide="plus" class="w-4 h-4"></i> Add Room</button>
                                    <button type="button" id="pkg-btn-done-travelers" class="w-full bg-brand-coral text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-coral-dark shadow-elegant hover:shadow-elegant-lg transition-all transform active:scale-95">Applied</button>
                                </div>
                            </div>
                            <!-- Cabin Class -->
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0 cursor-pointer custom-select">
                                <i data-lucide="armchair" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Cabin Class</label>
                                    <div id="pkg-cabin-val" class="selected-val w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate">Economy</div>
                                </div>
                                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-brand-slate absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                                <!-- Options -->
                                <div class="custom-options hidden absolute top-[110%] left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                                     <div class="option-item p-3 hover:bg-gray-50 text-sm font-semibold text-brand-navy cursor-pointer">Economy</div>
                                     <div class="option-item p-3 hover:bg-gray-50 text-sm font-semibold text-brand-navy cursor-pointer">Premium Economy</div>
                                     <div class="option-item p-3 hover:bg-gray-50 text-sm font-semibold text-brand-navy cursor-pointer">Business</div>
                                     <div class="option-item p-3 hover:bg-gray-50 text-sm font-semibold text-brand-navy cursor-pointer">First</div>
                                </div>
                            </div>
                        </div>

                        <!-- Checkbox Row -->
                        <div class="flex items-center gap-3 mb-5 px-4 py-2 w-fit transition-all duration-300">
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <div class="relative flex items-center">
                                    <input type="checkbox" id="pkg-partial-hotel" class="peer appearance-none w-5 h-5 border-2 border-white/70 rounded-md checked:bg-brand-coral checked:border-brand-coral transition-all duration-200">
                                    <i data-lucide="check" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></i>
                                </div>
                                <span class="text-sm text-white/90 font-semibold group-hover:text-white transition-colors select-none">I only need a hotel for part of my trip</span>
                            </label>
                        </div>

                        <!-- Expanded Hotel Section -->
                        <div id="pkg-partial-dates-container" class="hidden transition-all duration-300 mb-5">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
                                <!-- Dates -->
                                <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0">
                                    <i data-lucide="calendar" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                    <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                        <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Hotel Dates</label>
                                        <input type="text" id="pkg-hotel-dates" placeholder="Check-in - Check-out" class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Search Button Row -->
                        <div class="flex flex-col md:flex-row justify-end items-center gap-4">
                            <button id="pkg-search-btn" class="btn-primary bg-brand-coral hover:bg-brand-coral-dark text-white h-14 px-10 rounded-xl font-bold text-lg shadow-elegant hover:shadow-elegant-lg transition-all duration-300 flex items-center justify-center gap-2.5 w-full md:w-auto relative overflow-hidden">
                                <span class="relative z-10">Search Packages</span>
                                <i data-lucide="briefcase" class="w-5 h-5 relative z-10"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Hotels Form -->
                    <div class="search-form hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 items-end" id="hotels-form">
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0">
                            <i data-lucide="map-pin" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Destination</label>
                                <input type="text" id="ht-dest" data-type="any" placeholder="Where are you going?" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0">
                            <i data-lucide="calendar" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Check-in - Check-out</label>
                                <input type="text" id="ht-dates" placeholder="Add dates" class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center group min-w-0 cursor-pointer" id="traveler-trigger">
                            <i data-lucide="users" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Guests</label>
                                <input type="text" id="traveler-summary" placeholder="2 Guests, 1 Room" readonly class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light cursor-pointer">
                            </div>
                            <!-- Popover -->
                            <div id="traveler-popover" class="absolute top-[120%] left-0 w-[320px] bg-white rounded-xl shadow-elegant-xl p-5 hidden z-[60] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 cursor-default">
                                <div id="rooms-container" class="max-h-[300px] overflow-y-auto mb-4 custom-scrollbar"></div>
                                <button type="button" id="btn-add-room" class="text-brand-coral font-bold text-sm mb-4 hover:underline flex items-center gap-1"><i data-lucide="plus" class="w-4 h-4"></i> Add Room</button>
                                <button type="button" id="btn-done-travelers" class="w-full bg-brand-coral text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-coral-dark shadow-elegant hover:shadow-elegant-lg transition-all transform active:scale-95">Applied</button>
                            </div>
                        </div>
                        <button id="hotel-search-btn" class="btn-primary bg-brand-coral hover:bg-brand-coral-dark text-white h-14 px-8 rounded-xl font-bold text-lg shadow-elegant transition-all duration-300 flex items-center justify-center gap-2 md:col-span-2 lg:col-span-1 relative overflow-hidden">
                            <i data-lucide="search" class="w-5 h-5 relative z-10"></i> <span class="relative z-10">Search</span>
                        </button>
                    </div>

                    <!-- Flights Form -->
                    <div class="search-form hidden" id="flights-form">
                        <!-- Trip Type Radios -->
                        <div class="flex gap-6 mb-3 px-1">
                             <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="ft_type" value="round" checked class="accent-brand-coral w-4 h-4 cursor-pointer">
                                <span class="text-white/90 text-sm font-semibold group-hover:text-white transition-colors">Round Trip</span>
                             </label>
                             <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="ft_type" value="oneway" class="accent-brand-coral w-4 h-4 cursor-pointer">
                                <span class="text-white/90 text-sm font-semibold group-hover:text-white transition-colors">One Way</span>
                             </label>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.8fr_auto] gap-3 items-end">
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group">
                                <i data-lucide="plane-takeoff" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">From</label>
                                    <input type="text" id="fl-origin" data-type="airport_code" placeholder="Origin City" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                </div>
                            </div>
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group">
                                <i data-lucide="plane-landing" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">To</label>
                                    <input type="text" id="fl-dest" data-type="airport_code" placeholder="Destination" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                </div>
                            </div>
                            <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group">
                                <i data-lucide="calendar-days" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Dates</label>
                                    <input type="text" id="fl-dates" placeholder="Depart - Return" class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                                </div>
                            </div>
                            <!-- Flights Pax & Cabin -->
                             <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group cursor-pointer" id="fl-pax-trigger">
                                <i data-lucide="user" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                                <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                    <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Travellers</label>
                                    <input type="text" id="fl-pax-display" placeholder="1 Adult" readonly class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light cursor-pointer">
                                </div>
                                <!-- Popover -->
                                <div id="fl-pax-menu" class="absolute top-[120%] right-0 w-[280px] bg-white rounded-xl shadow-elegant-xl p-5 hidden z-[60] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 cursor-default">
                                    <div class="flex justify-between items-center mb-3">
                                        <div class="text-sm font-bold text-brand-navy">Adults</div>
                                        <div class="flex items-center gap-2">
                                            <button class="pax-btn w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" data-type="adt" data-action="minus">-</button>
                                            <span id="count-adt" class="font-bold w-4 text-center">1</span>
                                            <button class="pax-btn w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" data-type="adt" data-action="plus">+</button>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center mb-3">
                                        <div class="text-sm font-bold text-brand-navy">Children</div>
                                        <div class="flex items-center gap-2">
                                            <button class="pax-btn w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" data-type="chd" data-action="minus">-</button>
                                            <span id="count-chd" class="font-bold w-4 text-center">0</span>
                                            <button class="pax-btn w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" data-type="chd" data-action="plus">+</button>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center mb-3">
                                        <div class="text-sm font-bold text-brand-navy">Infants</div>
                                        <div class="flex items-center gap-2">
                                            <button class="pax-btn w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" data-type="inf" data-action="minus">-</button>
                                            <span id="count-inf" class="font-bold w-4 text-center">0</span>
                                            <button class="pax-btn w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" data-type="inf" data-action="plus">+</button>
                                        </div>
                                    </div>
                                     <div class="mb-3 border-t pt-3">
                                         <label class="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Cabin</label>
                                         <div class="relative custom-select cursor-pointer border rounded px-2 py-1">
                                             <span id="fl-cabin-val" class="selected-val text-sm font-bold">Economy</span>
                                         </div>
                                         <div class="custom-options hidden absolute bg-white shadow-lg border rounded mt-1 z-50 w-full left-0">
                                            <div class="option-item p-2 hover:bg-gray-50 text-sm">Economy</div>
                                            <div class="option-item p-2 hover:bg-gray-50 text-sm">Business</div>
                                            <div class="option-item p-2 hover:bg-gray-50 text-sm">First</div>
                                         </div>
                                    </div>
                                    
                                    <div id="chd-ages-container" class="hidden mb-3 border-t pt-3">
                                        <div id="chd-ages-grid" class="grid grid-cols-2 gap-2"></div>
                                    </div>
                                    <button id="btn-done-pax" class="w-full bg-brand-coral text-white py-2 rounded-lg font-bold text-xs">Done</button>
                                </div>
                            </div>

                            <button id="flight-search-btn" class="btn-primary bg-brand-coral hover:bg-brand-coral-dark text-white h-14 px-8 rounded-xl font-bold text-lg shadow-elegant transition-all duration-300 md:col-span-2 lg:col-span-1 relative overflow-hidden">
                                <span class="relative z-10">Search</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tours Form -->
                    <form class="search-form hidden grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end" id="tours-form">
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group">
                            <i data-lucide="search" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Things to do</label>
                                <input type="text" id="tour-dest" placeholder="Attractions, tours, activities..." class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group">
                            <i data-lucide="calendar-days" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Dates</label>
                                <input type="text" id="tour-dates" placeholder="Add dates" class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>
                        <button id="tour-search-btn" class="btn-primary bg-brand-coral hover:bg-brand-coral-dark text-white h-14 px-8 rounded-xl font-bold text-lg shadow-elegant transition-all duration-300 relative overflow-hidden">
                            <span class="relative z-10">Explore</span>
                        </button>
                    </form>

                    <!-- Transfers Form -->
                    <div class="search-form hidden grid grid-cols-1 md:grid-cols-[1.5fr_auto_1.5fr_1fr_1fr_auto] gap-3 items-end" id="transfers-form">
                        <!-- Input 1 (Left) -->
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group order-1">
                            <i data-lucide="plane" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Pickup</label>
                                <input type="text" id="tr-pickup" data-type="airport_code" placeholder="Select Airport" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>

                        <!-- Swap Button -->
                        <div class="flex items-center justify-center h-14 order-2">
                            <button type="button" id="btn-swap-transfer" class="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-brand-coral hover:text-brand-coral shadow-sm flex items-center justify-center transition-all duration-300 group">
                                <i data-lucide="arrow-left-right" class="w-4 h-4 text-brand-slate group-hover:text-brand-coral transition-colors"></i>
                            </button>
                        </div>

                        <!-- Input 2 (Right) -->
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group order-3">
                            <i data-lucide="building-2" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Dropoff</label>
                                <input type="text" id="tr-dropoff" data-type="any" placeholder="Select Hotel or City" class="auto-input w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>

                        <!-- Date -->
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group order-4">
                            <i data-lucide="calendar" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Pickup Date</label>
                                <input type="text" id="tr-date" placeholder="Date" class="w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate placeholder:text-brand-slate-light">
                            </div>
                        </div>

                        <!-- Time -->
                        <div class="input-container bg-white hover:bg-white h-14 px-4 rounded-xl border-2 border-white/50 focus-within:border-brand-gold focus-within:shadow-elegant transition-all duration-300 relative flex items-center min-w-0 group order-5 custom-select cursor-pointer">
                            <i data-lucide="clock" class="input-icon w-5 h-5 text-brand-slate flex-shrink-0 group-focus-within:text-brand-gold transition-colors"></i>
                            <div class="ml-3 w-full min-w-0 flex flex-col justify-center h-full">
                                <label class="block text-[10px] uppercase tracking-wider text-brand-slate font-bold mb-0 leading-none truncate">Time</label>
                                <div id="tr-time-val" class="selected-val w-full bg-transparent outline-none text-brand-navy font-semibold text-sm leading-tight truncate">12:00</div>
                            </div>
                             <div id="tr-time-opts" class="custom-options hidden absolute top-[110%] left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-y-auto max-h-40"></div>
                        </div>

                        <button id="btn-search-transfer" class="btn-primary bg-brand-coral hover:bg-brand-coral-dark text-white h-14 px-8 rounded-xl font-bold text-lg shadow-elegant transition-all duration-300 md:col-span-1 relative overflow-hidden order-6">
                            <span class="relative z-10">Search</span>
                        </button>
                    </div>
`;

// 3. Find Block to Replace
const startMark = '<!-- Packages Form -->';
const endMark = '</form>';
const topDest = '<!-- ================= TOP DESTINATIONS';

const tdIdx = content.indexOf(topDest);
const searchPart = content.substring(0, tdIdx);
const startIdx = searchPart.indexOf(startMark);
const endIdx = searchPart.lastIndexOf(endMark);

if (startIdx !== -1 && endIdx !== -1) {
    // Replace content from startIdx to endIdx + length of endMark
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + endMark.length);
    const final = before + newFormsHTML + after;
    fs.writeFileSync(filePath, final);
    console.log("Replaced Forms Block");
} else {
    console.error("Could not find blocks");
}
