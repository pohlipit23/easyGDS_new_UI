document.addEventListener('DOMContentLoaded', () => {
    // --- Helper: UUID Generator ---
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // --- Helper: Date Formatter (YYYY-MM-DD) ---
    function formatDate(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Helper: Default Dates (Next Week) ---
    function getDefaultDates() {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const weekAfter = new Date(nextWeek);
        weekAfter.setDate(nextWeek.getDate() + 3);
        return {
            start: formatDate(nextWeek),
            end: formatDate(weekAfter),
            startObj: nextWeek,
            endObj: weekAfter
        };
    }

    // --- Shared Data ---
    // Using the known working ID for all products as the valid configuration ID.
    const SHARED_CONFIG_ID = 'aaa34775-f480-477c-a656-f7a9a07ce605';
    const CONFIG_IDS = {
        bundle: SHARED_CONFIG_ID,
        hotel: SHARED_CONFIG_ID,
        flight: SHARED_CONFIG_ID,
        tour: 'ddd85aba-76ad-47f0-abd4-a36d7767b624', // Specific working ID for Tours
        transfer: SHARED_CONFIG_ID
    };
    const SESSION_ID = '5f3fb160953e443f99c507bc1f73b727'; // Consistent session ID

    // ... (rest of the file) ...

    // ==========================================
    // 4. TOURS FORM
    // ==========================================
    (function initTours() {
        const searchBtn = document.getElementById('tour-search-btn');
        if (!searchBtn) return;

        const inputs = {
            dest: document.getElementById('tour-dest')
        };
        // Changing to default to 2766 (Singapore) as seen in working URL
        const selectedDest = { code: '2766', type: 'place_id', name: 'Singapore' };

        // Setup autocomplete to allow searching (mock implementation)
        setupAutocomplete(inputs.dest, selectedDest);

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const destCode = selectedDest.code || '2766';
            const def = getDefaultDates();

            // Hardcode use place_id if it's the default backup, to ensure it works
            const finalDestCode = destCode.length === 3 ? destCode : '2766';
            const finalDestType = destCode.length === 3 ? 'airport_code' : 'place_id';

            const travelersObj = [{ "type": "adult", "age": 12, "room": 1 }];

            const expectationObj = {
                "is_separate": false,
                "tr_des_code": finalDestCode,
                "tr_des_type": finalDestType,
                "tr_start_date": def.start,
                "tr_end_date": def.end
            };

            const queryParams = [
                `process=tour`,
                `currency_code=USD`, // Changed to USD
                `language_code=en-US`,
                `package_id=${CONFIG_IDS.tour}`,
                `travelers=${encodeURIComponent(JSON.stringify(travelersObj))}`,
                `expectation=${encodeURIComponent(JSON.stringify(expectationObj))}`,
                `flight_campaign=`,
                `partner_id=`,
                `session_id=0c02ad321aaa490ebd227878a0e527ff`, // Updated Session ID
                `office_domain=demo.b2c.easygds.com`,
                `scope_type=B2C`
            ].join('&');

            window.location.href = `https://demo.apps.easygds.com/shopping/processes/tour?${queryParams}`;
        });
    })();

    // Autocomplete Mock Data - Enhanced Structure
    // Airports include ancestor data to link to cities/countries for destination filtering
    const locations = [
        // ==================== AIRPORTS ====================
        {
            city: "Singapore", country: "Singapore", code: "SIN", id: "SIN", name: "Singapore Changi Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "SG" }, { type: "city", id: "2766" }]
        },
        {
            city: "London", country: "United Kingdom", code: "LHR", id: "LHR", name: "London Heathrow Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "GB" }, { type: "city", id: "LON" }]
        },
        {
            city: "London", country: "United Kingdom", code: "LGW", id: "LGW", name: "London Gatwick Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "GB" }, { type: "city", id: "LON" }]
        },
        {
            city: "Penang", country: "Malaysia", code: "PEN", id: "PEN", name: "Penang International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "MY" }, { type: "city", id: "5129552" }]
        },
        {
            city: "Kuala Lumpur", country: "Malaysia", code: "KUL", id: "KUL", name: "Kuala Lumpur International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "MY" }, { type: "city", id: "KUL_CITY" }]
        },
        {
            city: "Bangkok", country: "Thailand", code: "BKK", id: "BKK", name: "Suvarnabhumi Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "TH" }, { type: "city", id: "BKK_CITY" }]
        },
        {
            city: "Bangkok", country: "Thailand", code: "DMK", id: "DMK", name: "Don Mueang International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "TH" }, { type: "city", id: "BKK_CITY" }]
        },
        {
            city: "Phuket", country: "Thailand", code: "HKT", id: "HKT", name: "Phuket International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "TH" }, { type: "city", id: "HKT_CITY" }]
        },
        {
            city: "Bali", country: "Indonesia", code: "DPS", id: "DPS", name: "Ngurah Rai International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "ID" }, { type: "city", id: "BALI" }]
        },
        {
            city: "Tokyo", country: "Japan", code: "NRT", id: "NRT", name: "Narita International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "JP" }, { type: "city", id: "TYO" }]
        },
        {
            city: "Tokyo", country: "Japan", code: "HND", id: "HND", name: "Tokyo Haneda Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "JP" }, { type: "city", id: "TYO" }]
        },
        {
            city: "Paris", country: "France", code: "CDG", id: "CDG", name: "Charles de Gaulle Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "FR" }, { type: "city", id: "PAR" }]
        },
        {
            city: "Paris", country: "France", code: "ORY", id: "ORY", name: "Paris Orly Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "FR" }, { type: "city", id: "PAR" }]
        },
        {
            city: "Dubai", country: "UAE", code: "DXB", id: "DXB", name: "Dubai International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "AE" }, { type: "city", id: "DXB_CITY" }]
        },
        {
            city: "Milan", country: "Italy", code: "MXP", id: "MXP", name: "Milan Malpensa Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "IT" }, { type: "city", id: "MIL" }]
        },
        {
            city: "New York", country: "USA", code: "JFK", id: "JFK", name: "John F. Kennedy International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "US" }, { type: "city", id: "NYC" }]
        },
        {
            city: "Los Angeles", country: "USA", code: "LAX", id: "LAX", name: "Los Angeles International Airport", type: "airport_code",
            ancestors: [{ type: "country", id: "US" }, { type: "city", id: "LAX_CITY" }]
        },

        // ==================== CITIES / PLACES ====================
        {
            city: "Singapore", country: "Singapore", code: "2766", id: "2766", name: "Singapore", type: "place_id",
            ancestors: [{ type: "country", id: "SG" }]
        },
        {
            city: "London", country: "United Kingdom", code: "LON", id: "LON", name: "London", type: "place_id",
            ancestors: [{ type: "country", id: "GB" }]
        },
        {
            city: "Penang", country: "Malaysia", code: "5129552", id: "5129552", name: "Penang", type: "place_id",
            ancestors: [{ type: "country", id: "MY" }]
        },
        {
            city: "Bangkok", country: "Thailand", code: "BKK_CITY", id: "BKK_CITY", name: "Bangkok", type: "place_id",
            ancestors: [{ type: "country", id: "TH" }]
        },
        {
            city: "Phuket", country: "Thailand", code: "HKT_CITY", id: "HKT_CITY", name: "Phuket", type: "place_id",
            ancestors: [{ type: "country", id: "TH" }]
        },
        {
            city: "Bali", country: "Indonesia", code: "BALI", id: "BALI", name: "Bali", type: "place_id",
            ancestors: [{ type: "country", id: "ID" }]
        },
        {
            city: "Tokyo", country: "Japan", code: "TYO", id: "TYO", name: "Tokyo", type: "place_id",
            ancestors: [{ type: "country", id: "JP" }]
        },
        {
            city: "Paris", country: "France", code: "PAR", id: "PAR", name: "Paris", type: "place_id",
            ancestors: [{ type: "country", id: "FR" }]
        },
        {
            city: "Dubai", country: "UAE", code: "DXB_CITY", id: "DXB_CITY", name: "Dubai", type: "place_id",
            ancestors: [{ type: "country", id: "AE" }]
        },

        // ==================== HOTELS ====================
        // Singapore Hotels
        { city: "Singapore", country: "Singapore", code: "H1001", id: "H1001", name: "Marina Bay Sands", type: "hotel", parent_code: "2766", ancestors: [{ type: "city", id: "2766" }, { type: "country", id: "SG" }] },
        { city: "Singapore", country: "Singapore", code: "H1002", id: "H1002", name: "Raffles Hotel Singapore", type: "hotel", parent_code: "2766", ancestors: [{ type: "city", id: "2766" }, { type: "country", id: "SG" }] },
        { city: "Singapore", country: "Singapore", code: "H1003", id: "H1003", name: "The Fullerton Hotel", type: "hotel", parent_code: "2766", ancestors: [{ type: "city", id: "2766" }, { type: "country", id: "SG" }] },

        // London Hotels
        { city: "London", country: "United Kingdom", code: "H5001", id: "H5001", name: "The Savoy", type: "hotel", parent_code: "LON", ancestors: [{ type: "city", id: "LON" }, { type: "country", id: "GB" }] },
        { city: "London", country: "United Kingdom", code: "H5002", id: "H5002", name: "The Ritz London", type: "hotel", parent_code: "LON", ancestors: [{ type: "city", id: "LON" }, { type: "country", id: "GB" }] },
        { city: "London", country: "United Kingdom", code: "H5003", id: "H5003", name: "Claridge's", type: "hotel", parent_code: "LON", ancestors: [{ type: "city", id: "LON" }, { type: "country", id: "GB" }] },

        // Penang Hotels
        { city: "Penang", country: "Malaysia", code: "H2001", id: "H2001", name: "Shangri-La Rasa Sayang", type: "hotel", parent_code: "5129552", ancestors: [{ type: "city", id: "5129552" }, { type: "country", id: "MY" }] },
        { city: "Penang", country: "Malaysia", code: "H2002", id: "H2002", name: "Eastern & Oriental Hotel", type: "hotel", parent_code: "5129552", ancestors: [{ type: "city", id: "5129552" }, { type: "country", id: "MY" }] },

        // Bangkok Hotels
        { city: "Bangkok", country: "Thailand", code: "H3001", id: "H3001", name: "Mandarin Oriental Bangkok", type: "hotel", parent_code: "BKK_CITY", ancestors: [{ type: "city", id: "BKK_CITY" }, { type: "country", id: "TH" }] },
        { city: "Bangkok", country: "Thailand", code: "H3002", id: "H3002", name: "The Peninsula Bangkok", type: "hotel", parent_code: "BKK_CITY", ancestors: [{ type: "city", id: "BKK_CITY" }, { type: "country", id: "TH" }] },
        { city: "Bangkok", country: "Thailand", code: "H3003", id: "H3003", name: "Anantara Riverside", type: "hotel", parent_code: "BKK_CITY", ancestors: [{ type: "city", id: "BKK_CITY" }, { type: "country", id: "TH" }] },

        // Phuket Hotels
        { city: "Phuket", country: "Thailand", code: "H4001", id: "H4001", name: "Amanpuri", type: "hotel", parent_code: "HKT_CITY", ancestors: [{ type: "city", id: "HKT_CITY" }, { type: "country", id: "TH" }] },
        { city: "Phuket", country: "Thailand", code: "H4002", id: "H4002", name: "Banyan Tree Phuket", type: "hotel", parent_code: "HKT_CITY", ancestors: [{ type: "city", id: "HKT_CITY" }, { type: "country", id: "TH" }] },
        { city: "Phuket", country: "Thailand", code: "H4003", id: "H4003", name: "Trisara", type: "hotel", parent_code: "HKT_CITY", ancestors: [{ type: "city", id: "HKT_CITY" }, { type: "country", id: "TH" }] },

        // Bali Hotels
        { city: "Bali", country: "Indonesia", code: "H6001", id: "H6001", name: "Four Seasons Bali", type: "hotel", parent_code: "BALI", ancestors: [{ type: "city", id: "BALI" }, { type: "country", id: "ID" }] },
        { city: "Bali", country: "Indonesia", code: "H6002", id: "H6002", name: "The Mulia Bali", type: "hotel", parent_code: "BALI", ancestors: [{ type: "city", id: "BALI" }, { type: "country", id: "ID" }] },
        { city: "Bali", country: "Indonesia", code: "H6003", id: "H6003", name: "COMO Uma Ubud", type: "hotel", parent_code: "BALI", ancestors: [{ type: "city", id: "BALI" }, { type: "country", id: "ID" }] },

        // Tokyo Hotels
        { city: "Tokyo", country: "Japan", code: "H7001", id: "H7001", name: "Park Hyatt Tokyo", type: "hotel", parent_code: "TYO", ancestors: [{ type: "city", id: "TYO" }, { type: "country", id: "JP" }] },
        { city: "Tokyo", country: "Japan", code: "H7002", id: "H7002", name: "Aman Tokyo", type: "hotel", parent_code: "TYO", ancestors: [{ type: "city", id: "TYO" }, { type: "country", id: "JP" }] },
        { city: "Tokyo", country: "Japan", code: "H7003", id: "H7003", name: "The Peninsula Tokyo", type: "hotel", parent_code: "TYO", ancestors: [{ type: "city", id: "TYO" }, { type: "country", id: "JP" }] },

        // Paris Hotels
        { city: "Paris", country: "France", code: "H8001", id: "H8001", name: "The Ritz Paris", type: "hotel", parent_code: "PAR", ancestors: [{ type: "city", id: "PAR" }, { type: "country", id: "FR" }] },
        { city: "Paris", country: "France", code: "H8002", id: "H8002", name: "Four Seasons George V", type: "hotel", parent_code: "PAR", ancestors: [{ type: "city", id: "PAR" }, { type: "country", id: "FR" }] },
        { city: "Paris", country: "France", code: "H8003", id: "H8003", name: "Le Bristol Paris", type: "hotel", parent_code: "PAR", ancestors: [{ type: "city", id: "PAR" }, { type: "country", id: "FR" }] },

        // Dubai Hotels
        { city: "Dubai", country: "UAE", code: "H9001", id: "H9001", name: "Burj Al Arab", type: "hotel", parent_code: "DXB_CITY", ancestors: [{ type: "city", id: "DXB_CITY" }, { type: "country", id: "AE" }] },
        { city: "Dubai", country: "UAE", code: "H9002", id: "H9002", name: "Atlantis The Palm", type: "hotel", parent_code: "DXB_CITY", ancestors: [{ type: "city", id: "DXB_CITY" }, { type: "country", id: "AE" }] },
        { city: "Dubai", country: "UAE", code: "H9003", id: "H9003", name: "One&Only The Palm", type: "hotel", parent_code: "DXB_CITY", ancestors: [{ type: "city", id: "DXB_CITY" }, { type: "country", id: "AE" }] }
    ];

    // --- Autocomplete Setup ---
    function setupAutocomplete(inputElement, selectionObj, allowedTypes = ['airport_code', 'place_id'], filterContext = null) {
        if (!inputElement) return;

        const listContainer = document.createElement('ul');
        listContainer.className = 'absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 hidden mt-1';
        inputElement.parentNode.style.position = 'relative';
        inputElement.parentNode.appendChild(listContainer);

        function doFilter() {
            const val = inputElement.value.toLowerCase();
            listContainer.innerHTML = '';

            // If the input is empty and no context, require at least 2 chars to search
            // If context exists AND has a valid place_context_id, show context-filtered results even with empty query
            const hasValidContext = filterContext && filterContext.place_context_id;

            if (val.length < 2 && !hasValidContext) {
                listContainer.classList.add('hidden');
                return;
            }

            const matches = locations.filter(item => {
                const matchesText = val.length < 2 ? true : (
                    item.city.toLowerCase().includes(val) ||
                    item.code.toLowerCase().includes(val) ||
                    item.country.toLowerCase().includes(val) ||
                    item.name.toLowerCase().includes(val)
                );

                const matchesType = allowedTypes.includes(item.type) ||
                    (allowedTypes.includes('place_id') && item.type === 'hotel');

                // Logic from Reference Vue `location-picker/index.vue`:
                // If Airport is selected (`filterContext` exists with valid place_context_id), 
                // it passes `place_id` (derived from ancestors) to the destination picker.
                // This `place_id` is used to filter results (in the real app via API, here via mock filtering).

                let matchesContext = true;

                // Only apply context filtering if we have a valid context ID
                if (hasValidContext && (item.type === 'hotel' || item.type === 'place_id')) {
                    // Check if item's ancestors contain the context ID
                    // The Vue logic uses: ancestors_type?.country?.[0]?.id ?? city ?? province etc.
                    // So we should match against city ID first, then fall back to country

                    if (item.ancestors && item.ancestors.length > 0) {
                        // Check if any ancestor matches the context ID
                        const matchId = item.ancestors.some(a => a.id === filterContext.place_context_id);
                        matchesContext = matchId;
                    } else if (item.parent_code) {
                        // Fallback to direct parent_code check for legacy items
                        matchesContext = (item.parent_code === filterContext.place_context_id);
                    } else {
                        // No ancestors and no parent_code - don't filter it out if searching by text
                        matchesContext = val.length >= 2;
                    }
                }

                // If NO valid context (Hotel First mode or no airport selected), 
                // allow global search for destinations and hotels
                // Only exclude airports from destination input when context is set
                const excludeAirports = (item.type === 'airport_code' && filterContext);

                return matchesText && matchesType && matchesContext && !excludeAirports;
            });

            if (matches.length > 0) {
                matches.forEach(item => {
                    let icon = '🏙️';
                    if (item.type === 'airport_code') icon = '✈️';
                    if (item.type === 'hotel') icon = '🏨';

                    const li = document.createElement('li');
                    li.className = 'px-4 py-3 hover:bg-brand-warm-gray cursor-pointer flex justify-between items-center group transition-colors';
                    li.innerHTML = `
                        <div class="flex flex-col">
                            <span class="font-bold text-brand-navy text-sm">${icon} ${item.name}</span>
                            <span class="text-xs text-brand-slate group-hover:text-brand-coral transition-colors">${item.city}, ${item.country}</span>
                        </div>
                    `;
                    li.addEventListener('click', () => {
                        inputElement.value = item.name;
                        if (selectionObj) {
                            selectionObj.code = item.code;
                            // Use item.id if available, otherwise fall back to code
                            // This matches Vue behavior where destination.id is used for tf_place_code
                            selectionObj.id = item.id || item.code;
                            selectionObj.type = item.type;
                            selectionObj.name = item.name;
                            selectionObj.ancestors = item.ancestors;

                            // Calculate Context ID if this is an Airport (for filtering destinations)
                            if (item.type === 'airport_code' && item.ancestors) {
                                const city = item.ancestors.find(a => a.type === 'city');
                                const country = item.ancestors.find(a => a.type === 'country');
                                selectionObj.place_context_id = city ? city.id : (country ? country.id : null);
                            }
                        }
                        listContainer.classList.add('hidden');

                        // Fire event to notify listeners (simple implementation)
                        if (inputElement.dispatchEvent) {
                            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                    listContainer.appendChild(li);
                });
                listContainer.classList.remove('hidden');
            } else {
                listContainer.classList.add('hidden');
            }
        }

        inputElement.addEventListener('input', doFilter);
        inputElement.addEventListener('focus', doFilter);
        document.addEventListener('click', (e) => {
            if (!inputElement.contains(e.target) && !listContainer.contains(e.target)) {
                listContainer.classList.add('hidden');
            }
        });
    }

    // --- Flatpickr Setup ---
    function setupDateRange(inputElement) {
        if (!inputElement) return;
        flatpickr(inputElement, {
            mode: "range",
            dateFormat: "d M Y",
            minDate: "today",
            showMonths: 2,
            onChange: function (selectedDates) {
                if (selectedDates.length === 2) {
                    inputElement.dataset.startDate = formatDate(selectedDates[0]);
                    inputElement.dataset.endDate = formatDate(selectedDates[1]);
                }
            }
        });
    }

    function setupSingleDate(inputElement) {
        if (!inputElement) return;
        flatpickr(inputElement, {
            dateFormat: "d M Y",
            minDate: "today",
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) {
                    inputElement.dataset.date = formatDate(selectedDates[0]);
                }
            }
        });
    }

    function setupDateTime(inputElement) {
        if (!inputElement) return;
        flatpickr(inputElement, {
            enableTime: true,
            dateFormat: "d M Y H:i",
            minDate: "today",
            time_24hr: true,
            onChange: function (selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    inputElement.dataset.date = formatDate(selectedDates[0]);
                    // Format time as HH:MM
                    const hours = String(selectedDates[0].getHours()).padStart(2, '0');
                    const minutes = String(selectedDates[0].getMinutes()).padStart(2, '0');
                    inputElement.dataset.time = `${hours}:${minutes}`;
                }
            }
        });
    }

    function setupTimePicker(inputElement) {
        if (!inputElement) return;
        flatpickr(inputElement, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultDate: "12:00",
            onChange: function (selectedDates, dateStr) {
                inputElement.dataset.time = dateStr;
            }
        });
    }

    // Helper for Transfer Time Dropdown
    function setupTimeDropdown(inputElement) {
        if (!inputElement) return;

        // Populate dropdown with times
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = String(h).padStart(2, '0');
                const minute = String(m).padStart(2, '0');
                const time = `${hour}:${minute}`;
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                inputElement.appendChild(option);
            }
        }
        // Set default value
        inputElement.value = "12:00";
        inputElement.dataset.time = "12:00"; // Store in dataset for consistency

        inputElement.addEventListener('change', (e) => {
            inputElement.dataset.time = e.target.value;
        });
    }

    // ==========================================
    // 1. PACKAGES FORM (Bundle)
    // ==========================================
    (function initPackages() {
        const searchBtn = document.getElementById('pkg-search-btn');
        if (!searchBtn) return;

        const inputs = {
            origin: document.getElementById('pkg-origin'),
            dest: document.getElementById('pkg-dest'),
            dates: document.getElementById('pkg-dates'),
            travellers: document.getElementById('pkg-travellers'),
            cabin: document.getElementById('pkg-cabin'),
            exCity: document.getElementById('pkg-ex-city'),
            exCheckin: document.getElementById('pkg-ex-checkin'),
            exCheckout: document.getElementById('pkg-ex-checkout'),
            checkbox: document.getElementById('hotel-check'),
            expandedSection: document.getElementById('expanded-hotel-section')
        };
        const dropdownElements = {
            dropdown: document.getElementById('travellers-dropdown'),
            btn: document.getElementById('travellers-done-btn'),
            counts: {
                adults: document.getElementById('count-adults'),
                children: document.getElementById('count-children'),
                rooms: document.getElementById('count-rooms')
            }
        };

        // State
        const selectedOrigin = { code: '', type: 'airport_code' };
        const selectedDest = { code: '', type: 'airport_code' };
        const travelersState = { adults: 1, children: 0, rooms: 1 }; // Default match working URL

        // Init Components
        setupAutocomplete(inputs.origin, selectedOrigin);
        setupAutocomplete(inputs.dest, selectedDest);
        setupAutocomplete(inputs.exCity, null);
        setupDateRange(inputs.dates);
        setupSingleDate(inputs.exCheckin);
        setupSingleDate(inputs.exCheckout);

        // Interaction: Hotel Checkbox
        if (inputs.checkbox && inputs.expandedSection) {
            inputs.checkbox.addEventListener('change', (e) => {
                e.target.checked ? inputs.expandedSection.classList.remove('hidden') : inputs.expandedSection.classList.add('hidden');
            });
        }

        // Interaction: Travelers Dropdown (Basic Implementation reused)
        if (inputs.travellers && dropdownElements.dropdown) {
            function updateDisplay() {
                const total = travelersState.adults + travelersState.children;
                inputs.travellers.value = `${total} Traveller${total !== 1 ? 's' : ''}, ${travelersState.rooms} Room${travelersState.rooms !== 1 ? 's' : ''}`;
                if (dropdownElements.counts.adults) dropdownElements.counts.adults.textContent = travelersState.adults;
                if (dropdownElements.counts.children) dropdownElements.counts.children.textContent = travelersState.children;
                if (dropdownElements.counts.rooms) dropdownElements.counts.rooms.textContent = travelersState.rooms;
            }
            updateDisplay();

            inputs.travellers.addEventListener('click', (e) => { e.stopPropagation(); dropdownElements.dropdown.classList.remove('hidden'); });
            document.addEventListener('click', (e) => { if (!inputs.travellers.contains(e.target) && !dropdownElements.dropdown.contains(e.target)) dropdownElements.dropdown.classList.add('hidden'); });
            if (dropdownElements.btn) dropdownElements.btn.addEventListener('click', (e) => { e.preventDefault(); dropdownElements.dropdown.classList.add('hidden'); });

            dropdownElements.dropdown.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                const action = btn.dataset.action;
                const target = btn.dataset.target;
                if (action === 'increase') travelersState[target]++;
                if (action === 'decrease') {
                    if (target === 'adults' && travelersState.adults > 1) travelersState.adults--;
                    if (target === 'children' && travelersState.children > 0) travelersState.children--;
                    if (target === 'rooms' && travelersState.rooms > 1) travelersState.rooms--;
                }
                updateDisplay();
            });
        }


        // SUBMIT HANDLER
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const originCode = selectedOrigin.code || 'KUL';
            const destCode = selectedDest.code || 'PEN';
            let startDate = inputs.dates.dataset.startDate;
            let endDate = inputs.dates.dataset.endDate;

            if (!startDate || !endDate) {
                const def = getDefaultDates();
                startDate = def.start;
                endDate = def.end;
            }

            let cabinClass = inputs.cabin ? inputs.cabin.value : 'Economy';
            if (cabinClass === 'Economy') cabinClass = 'Economy'; // Title case fix

            // Build Travelers
            const travelersObj = [];
            for (let i = 0; i < travelersState.adults; i++) travelersObj.push({ "type": "adult", "age": 12, "room": (i % travelersState.rooms) + 1 });
            for (let i = 0; i < travelersState.children; i++) travelersObj.push({ "type": "child", "age": 10, "room": (i % travelersState.rooms) + 1 });

            const isSeparate = inputs.checkbox ? inputs.checkbox.checked : false;

            const expectationObj = {
                "fl_cabin_class": cabinClass,
                "fl_departure_date": startDate,
                "fl_return_date": endDate,
                "fl_round_trip": true,
                "start_place_code": originCode,
                "start_place_type": "airport_code",
                "des_code": destCode,
                "des_type": "airport_code",
                "ht_des_code": destCode,
                "ht_des_type": "airport_code",
                "ht_checkin_date": startDate,
                "ht_checkout_date": endDate,
                "is_separate": isSeparate,
                "stars": null
            };

            if (isSeparate) {
                expectationObj.is_separate = true;
                if (inputs.exCheckin.dataset.date) expectationObj.ht_checkin_date = inputs.exCheckin.dataset.date;
                if (inputs.exCheckout.dataset.date) expectationObj.ht_checkout_date = inputs.exCheckout.dataset.date;
            }

            const queryParams = [
                `process=bundle`,
                `place_type=airport`,
                `place_id=5129552`, // Default Penang
                `currency_code=EUR`,
                `language_code=en-US`,
                `package_id=${CONFIG_IDS.bundle}`, // Known working ID
                `travelers=${encodeURIComponent(JSON.stringify(travelersObj))}`,
                `is_separate=${isSeparate}`,
                `expectation=${encodeURIComponent(JSON.stringify(expectationObj))}`,
                `disabled_currency=true`,
                `session_id=${SESSION_ID}`,
                `office_domain=demo.b2c.easygds.com`,
                `scope_type=B2C`
            ].join('&');

            window.location.href = `https://demo.apps.easygds.com/shopping/processes/bundle?${queryParams}`;
        });
    })();


    // ==========================================
    // 2. HOTELS FORM
    // ==========================================
    (function initHotels() {
        const searchBtn = document.getElementById('hotel-search-btn');
        if (!searchBtn) return;

        const inputs = {
            dest: document.getElementById('hotel-dest'),
            dates: document.getElementById('hotel-dates'),
            guests: document.getElementById('hotel-guests')
        };
        const selectedDest = { code: '', type: 'place_id' }; // Hotels usually define dest by place_id or airport

        setupAutocomplete(inputs.dest, selectedDest);
        setupDateRange(inputs.dates);

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Defaults
            const destCode = selectedDest.code || 'PEN';
            const placeId = '5129552'; // Default Penang
            let startDate = inputs.dates.dataset.startDate;
            let endDate = inputs.dates.dataset.endDate;
            if (!startDate || !endDate) {
                const def = getDefaultDates();
                startDate = def.start;
                endDate = def.end;
            }

            // Simple Travelers (1 Adult default)
            const travelersObj = [{ "type": "adult", "age": 12, "room": 1 }];

            const expectationObj = {
                "ht_des_code": destCode,
                "ht_des_type": "airport_code", // Mocking airport code for mapped cities
                "ht_checkin_date": startDate,
                "ht_checkout_date": endDate,
                "is_separate": false
            };

            const queryParams = [
                `process=hotel`,
                `place_type=airport`,
                `place_id=${placeId}`,
                `currency_code=EUR`,
                `language_code=en-US`,
                `package_id=${CONFIG_IDS.hotel}`,
                `travelers=${encodeURIComponent(JSON.stringify(travelersObj))}`,
                `expectation=${encodeURIComponent(JSON.stringify(expectationObj))}`,
                `session_id=${SESSION_ID}`,
                `office_domain=demo.b2c.easygds.com`,
                `scope_type=B2C`
            ].join('&');

            window.location.href = `https://demo.apps.easygds.com/shopping/processes/hotel?${queryParams}`;
        });
    })();

    // ==========================================
    // 3. FLIGHTS FORM
    // ==========================================
    (function initFlights() {
        const searchBtn = document.getElementById('flight-search-btn');
        if (!searchBtn) return;

        const inputs = {
            origin: document.getElementById('flight-origin'),
            dest: document.getElementById('flight-dest'),
            dates: document.getElementById('flight-dates'),
            travellers: document.getElementById('flight-travellers')
        };
        const selectedOrigin = { code: '', type: 'airport_code' };
        const selectedDest = { code: '', type: 'airport_code' };

        // Flights strictly use airports
        setupAutocomplete(inputs.origin, selectedOrigin, ['airport_code']);
        setupAutocomplete(inputs.dest, selectedDest, ['airport_code']);
        setupDateRange(inputs.dates);

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const originCode = selectedOrigin.code || 'KUL';
            const destCode = selectedDest.code || 'PEN';
            let startDate = inputs.dates.dataset.startDate;
            let endDate = inputs.dates.dataset.endDate;
            if (!startDate || !endDate) {
                const def = getDefaultDates();
                startDate = def.start;
                endDate = def.end;
            }

            const travelersObj = [{ "type": "adult", "age": 12, "room": 1 }];

            const expectationObj = {
                "is_multi_city": false,
                "start_place_code": originCode,
                "start_place_type": "airport_code",
                "des_code": destCode,
                "des_type": "airport_code",
                "fl_cabin_class": "Economy",
                "fl_departure_date": startDate,
                "fl_return_date": endDate,
                "fl_round_trip": true
            };

            const queryParams = [
                `process=flight`,
                `currency_code=EUR`,
                `language_code=en-US`,
                `package_id=${CONFIG_IDS.flight}`,
                `travelers=${encodeURIComponent(JSON.stringify(travelersObj))}`,
                `expectation=${encodeURIComponent(JSON.stringify(expectationObj))}`,
                `session_id=${SESSION_ID}`,
                `office_domain=demo.b2c.easygds.com`,
                `scope_type=B2C`
            ].join('&');

            window.location.href = `https://demo.apps.easygds.com/shopping/processes/flight?${queryParams}`;
        });
    })();

    // ==========================================
    // 4. TOURS FORM
    // ==========================================
    (function initTours() {
        const searchBtn = document.getElementById('tour-search-btn');
        if (!searchBtn) return;

        const inputs = {
            dest: document.getElementById('tour-dest'),
            dates: document.getElementById('tour-dates') // New Date Field
        };
        // Changing to default to 2766 (Singapore) as seen in working URL
        const selectedDest = { code: '2766', type: 'place_id', name: 'Singapore' };

        // Tours usually search by Place/City/Region
        setupAutocomplete(inputs.dest, selectedDest, ['place_id', 'airport_code']);
        setupDateRange(inputs.dates); // Setup Date Picker for Tours

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const destCode = selectedDest.code || '2766';
            const destType = selectedDest.type || 'place_id';

            let startDate = inputs.dates.dataset.startDate;
            let endDate = inputs.dates.dataset.endDate;

            if (!startDate || !endDate) {
                const def = getDefaultDates();
                startDate = def.start;
                endDate = def.end;
            }

            const travelersObj = [{ "type": "adult", "age": 12, "room": 1 }];

            const expectationObj = {
                "is_separate": false,
                "tr_des_code": destCode,
                "tr_des_type": destType,
                "tr_start_date": startDate,
                "tr_end_date": endDate
            };

            const queryParams = [
                `process=tour`,
                `currency_code=USD`, // Changed to USD to match working URL
                `language_code=en-US`,
                `package_id=${CONFIG_IDS.tour}`, // Working ID
                `travelers=${encodeURIComponent(JSON.stringify(travelersObj))}`,
                `expectation=${encodeURIComponent(JSON.stringify(expectationObj))}`,
                `flight_campaign=`,
                `partner_id=`,
                `session_id=0c02ad321aaa490ebd227878a0e527ff`, // Updated Session ID for Tours
                `office_domain=demo.b2c.easygds.com`,
                `scope_type=B2C`
            ].join('&');

            window.location.href = `https://demo.apps.easygds.com/shopping/processes/tour?${queryParams}`;
        });
    })();

    function setupTimeDropdown(inputElement) {
        if (!inputElement) return;

        const listContainer = document.createElement('ul');
        listContainer.className = 'absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 hidden mt-1';
        inputElement.parentNode.style.position = 'relative';
        inputElement.parentNode.appendChild(listContainer);

        // Generate Time Slots (30 min intervals)
        const times = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hour = String(i).padStart(2, '0');
                const min = String(j).padStart(2, '0');
                times.push(`${hour}:${min}`);
            }
        }

        times.forEach(time => {
            const li = document.createElement('li');
            li.className = 'px-4 py-2 hover:bg-brand-warm-gray cursor-pointer text-sm text-brand-navy font-medium transition-colors';
            li.textContent = time;
            li.addEventListener('click', () => {
                inputElement.value = time;
                inputElement.dataset.time = time;
                listContainer.classList.add('hidden');
            });
            listContainer.appendChild(li);
        });

        inputElement.addEventListener('click', () => {
            listContainer.classList.remove('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!inputElement.contains(e.target) && !listContainer.contains(e.target)) {
                listContainer.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // 5. TRANSFERS FORM
    // ==========================================
    (function initTransfers() {
        const searchBtn = document.getElementById('transfer-search-btn');
        const swapBtn = document.getElementById('transfer-swap-btn');
        if (!searchBtn) return;

        const inputs = {
            input1: document.getElementById('transfer-input-1'), // Airport (Initially)
            input2: document.getElementById('transfer-input-2'), // Destination (Initially)
            dateInput: document.getElementById('transfer-date'),
            timeInput: document.getElementById('transfer-time'),
            group1: document.getElementById('transfer-input-group-1'),
            group2: document.getElementById('transfer-input-group-2')
        };

        // State
        let isFromAirport = true;

        // Data Holders - Initial State: No selection to force proper user flow
        // The user requirement says "when staring with hotel/destination first, there is no hotel lookup happening".
        // This implies we should allow searching hotels globally if no airport is selected yet.
        const location1 = { code: '', id: '', type: 'airport_code', place_context_id: '' };
        const location2 = { code: '', id: '', type: 'place_id' };

        // Init Autocomplete
        // Input 1 (Airport) - Standard Airport Search
        setupAutocomplete(inputs.input1, location1, ['airport_code']);

        // Input 2 (Destination) - Linked to Location 1 Context
        // CRITICAL: We pass a reference to `location1`. `setupAutocomplete` checks `location1` properties DYNAMICALLY on every input.
        // If `location1.place_context_id` is empty (no airport selected), filters are OFF and global hotel search works.
        setupAutocomplete(inputs.input2, location2, ['place_id', 'hotel'], location1);

        // Listen for Airport Selection Change 
        // When airport changes, we might want to clear the destination if it doesn't match the new context?
        // For now, let's just rely on the user to re-select if they want. 
        // But the filter context updates automatically because we passed the object reference.

        // Swap Logic
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                isFromAirport = !isFromAirport;

                // Visual Swap logic from before was mostly CSS ordering.
                // We also need to consider labels if we want to be perfect, but the ID `transfer-label-1` is hardcoded "Airport".
                // In standard transfer flows, "From Airport" means Airport on Left. "To Airport" means Airport on right (or swapping functionality).
                // The inputs are labeled generic "Airport" and "Destination". 
                // If we swap, Input 1 is still logically the Airport and Input 2 is the Destination/Hotel. 
                // We just change the `tf_from_airport` flag and visual order.

                if (isFromAirport) {
                    inputs.group1.style.order = '1';
                    inputs.group2.style.order = '3';
                } else {
                    inputs.group1.style.order = '3';
                    inputs.group2.style.order = '1';
                }
            });
        }

        setupSingleDate(inputs.dateInput);
        setupTimeDropdown(inputs.timeInput);

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Use .id for the place code (matches Vue: tf_place_code: destination.id)
            // Fall back to .code if .id is not set
            const airportCode = location1.code || 'PEN';
            const placeId = location2.id || location2.code || 'H2001';

            // Logic to determine type param for API (matches Vue code logic)
            // tf_place_type: destination.type === 'hotel' ? 'property_id' : destination.type === 'airport' ? 'airport_code' : 'place_id'
            let placeTypeParam = 'place_id';
            if (location2.type === 'hotel') {
                placeTypeParam = 'property_id';
            } else if (location2.type === 'airport_code' || location2.type === 'airport') {
                placeTypeParam = 'airport_code';
            } else {
                placeTypeParam = 'place_id';
            }

            let pickDate = inputs.dateInput.dataset.date;
            let pickTime = inputs.timeInput.dataset.time || inputs.timeInput.value || "12:00";
            if (!pickDate) {
                const def = getDefaultDates();
                pickDate = def.start;
            }

            const travelersObj = [{ "type": "adult", "age": 12, "room": 1 }];

            const expectationObj = {
                "is_separate": false,
                "tf_airport_code": airportCode,
                "tf_from_airport": isFromAirport,
                "tf_pickup_date": pickDate,
                "tf_pickup_time": pickTime,
                "tf_place_code": placeId,
                "tf_place_type": placeTypeParam,
                "tf_round_trip": false,
                "tf_return_date": null,
                "tf_return_time": null
            };

            const queryParams = [
                `process=transfer`,
                `currency_code=EUR`,
                `language_code=en-US`,
                `package_id=${CONFIG_IDS.transfer}`,
                `travelers=${encodeURIComponent(JSON.stringify(travelersObj))}`,
                `expectation=${encodeURIComponent(JSON.stringify(expectationObj))}`,
                `session_id=${SESSION_ID}`,
                `office_domain=demo.b2c.easygds.com`,
                `scope_type=B2C`
            ].join('&');

            window.location.href = `https://demo.apps.easygds.com/shopping/processes/transfer?${queryParams}`;
        });
    })();

});
