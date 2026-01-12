document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const checkbox = document.getElementById('hotel-check');
    const expandedSection = document.getElementById('expanded-hotel-section');
    const searchBtn = document.getElementById('pkg-search-btn');

    // --- Inputs ---
    const originInput = document.getElementById('pkg-origin');
    const destInput = document.getElementById('pkg-dest');
    const datesInput = document.getElementById('pkg-dates');
    const travellersInput = document.getElementById('pkg-travellers');
    const cabinInput = document.getElementById('pkg-cabin');

    // Expanded inputs
    const exCityInput = document.getElementById('pkg-ex-city');
    const exCheckinInput = document.getElementById('pkg-ex-checkin');
    const exCheckoutInput = document.getElementById('pkg-ex-checkout');

    // --- Travelers State & Logic ---
    const travelersState = {
        adults: 1, // Changed to 1 to match working URL
        children: 0,
        rooms: 1
    };

    const travelersDropdown = document.getElementById('travellers-dropdown');
    const travelersDoneBtn = document.getElementById('travellers-done-btn');
    const countAdults = document.getElementById('count-adults');
    const countChildren = document.getElementById('count-children');
    const countRooms = document.getElementById('count-rooms');

    function updateTravelersDisplay() {
        if (!travellersInput) return;
        const parts = [];
        const totalPeople = travelersState.adults + travelersState.children;
        parts.push(`${totalPeople} Traveller${totalPeople !== 1 ? 's' : ''}`);
        parts.push(`${travelersState.rooms} Room${travelersState.rooms !== 1 ? 's' : ''}`);
        travellersInput.value = parts.join(', ');

        // Update counters in dropdown
        if (countAdults) countAdults.textContent = travelersState.adults;
        if (countChildren) countChildren.textContent = travelersState.children;
        if (countRooms) countRooms.textContent = travelersState.rooms;
    }

    // Initialize display
    updateTravelersDisplay();

    // Toggle Dropdown
    if (travellersInput && travelersDropdown) {
        travellersInput.addEventListener('click', (e) => {
            e.stopPropagation();
            travellersDropdown.classList.remove('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!travellersInput.contains(e.target) && !travelersDropdown.contains(e.target)) {
                travelersDropdown.classList.add('hidden');
            }
        });

        if (travelersDoneBtn) {
            travelersDoneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                travelersDropdown.classList.add('hidden');
            });
        }

        // Counter Logic
        travelersDropdown.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action;
            const target = btn.dataset.target; // adults, children, rooms

            if (!action || !target) return;

            e.preventDefault();

            if (action === 'increase') {
                travelersState[target]++;
            } else if (action === 'decrease') {
                if (target === 'adults' && travelersState.adults > 1) travelersState.adults--;
                if (target === 'children' && travelersState.children > 0) travelersState.children--;
                if (target === 'rooms' && travelersState.rooms > 1) travelersState.rooms--;
            }

            updateTravelersDisplay();
        });
    }

    // --- State for Airport Selection ---
    const selectedOrigin = { code: '', type: 'airport_code' };
    const selectedDest = { code: '', type: 'airport_code' };

    // --- Toggle Expanded Section ---
    if (checkbox && expandedSection) {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                expandedSection.classList.remove('hidden');
            } else {
                expandedSection.classList.add('hidden');
            }
        });
    }

    // --- Date Picker Initialization (Flatpickr) ---
    // Package Dates (Range)
    if (datesInput) {
        flatpickr(datesInput, {
            mode: "range",
            dateFormat: "d M Y",
            minDate: "today",
            showMonths: 2,
            onChange: function (selectedDates, dateStr, instance) {
                // Store raw dates on the input element for easier access
                if (selectedDates.length === 2) {
                    datesInput.dataset.startDate = formatDate(selectedDates[0]);
                    datesInput.dataset.endDate = formatDate(selectedDates[1]);
                }
            }
        });
    }

    // Hotel Section Dates (Single)
    if (exCheckinInput && exCheckoutInput) {
        const checkinPicker = flatpickr(exCheckinInput, {
            dateFormat: "d M Y",
            minDate: "today",
            onChange: function (selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    exCheckinInput.dataset.date = formatDate(selectedDates[0]);
                    checkoutPicker.set('minDate', selectedDates[0]);
                }
            }
        });

        const checkoutPicker = flatpickr(exCheckoutInput, {
            dateFormat: "d M Y",
            minDate: "today",
            onChange: function (selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    exCheckoutInput.dataset.date = formatDate(selectedDates[0]);
                }
            }
        });
    }

    function formatDate(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Autocomplete Data & Logic ---
    const airports = [
        { city: "Singapore", country: "Singapore", code: "SIN", name: "Changi Airport" },
        { city: "Bangkok", country: "Thailand", code: "BKK", name: "Suvarnabhumi Airport" },
        { city: "Kuala Lumpur", country: "Malaysia", code: "KUL", name: "Kuala Lumpur Intl" },
        { city: "Penang", country: "Malaysia", code: "PEN", name: "Penang Intl" },
        { city: "Langkawi", country: "Malaysia", code: "LGK", name: "Langkawi Intl" },
        { city: "Phuket", country: "Thailand", code: "HKT", name: "Phuket Intl" },
        { city: "Tokyo", country: "Japan", code: "NRT", name: "Narita Intl" },
        { city: "Tokyo", country: "Japan", code: "HND", name: "Haneda Airport" },
        { city: "London", country: "UK", code: "LHR", name: "Heathrow Airport" },
        { city: "London", country: "UK", code: "LGW", name: "Gatwick Airport" },
        { city: "Paris", country: "France", code: "CDG", name: "Charles de Gaulle" },
        { city: "New York", country: "USA", code: "JFK", name: "John F. Kennedy Intl" },
        { city: "Dubai", country: "UAE", code: "DXB", name: "Dubai Intl" },
        { city: "Hong Kong", country: "China", code: "HKG", name: "Hong Kong Intl" },
        { city: "Sydney", country: "Australia", code: "SYD", name: "Kingsford Smith" },
        { city: "Melbourne", country: "Australia", code: "MEL", name: "Tullamarine" }
    ];

    function setupAutocomplete(inputElement, selectionObj) {
        if (!inputElement) return;

        // Create Container for suggestions
        const listContainer = document.createElement('ul');
        listContainer.className = 'absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 hidden mt-1';
        inputElement.parentNode.style.position = 'relative';
        inputElement.parentNode.appendChild(listContainer);

        inputElement.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            listContainer.innerHTML = '';

            if (val.length < 2) {
                listContainer.classList.add('hidden');
                return;
            }

            const matches = airports.filter(item =>
                item.city.toLowerCase().includes(val) ||
                item.code.toLowerCase().includes(val) ||
                item.country.toLowerCase().includes(val)
            );

            if (matches.length > 0) {
                matches.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'px-4 py-3 hover:bg-brand-warm-gray cursor-pointer flex justify-between items-center group transition-colors';
                    li.innerHTML = `
                        <div class="flex flex-col">
                            <span class="font-bold text-brand-navy text-sm">${item.city} (${item.code})</span>
                            <span class="text-xs text-brand-slate group-hover:text-brand-coral transition-colors">${item.name}</span>
                        </div>
                        <span class="text-xs font-semibold text-brand-slate-light bg-brand-warm-gray px-2 py-1 rounded group-hover:bg-white group-hover:text-brand-coral transition-all">${item.country}</span>
                    `;
                    li.addEventListener('click', () => {
                        inputElement.value = `${item.city} (${item.code})`;
                        if (selectionObj) {
                            selectionObj.code = item.code;
                        }
                        listContainer.classList.add('hidden');
                    });
                    listContainer.appendChild(li);
                });
                listContainer.classList.remove('hidden');
            } else {
                listContainer.classList.add('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            if (!inputElement.contains(e.target) && !listContainer.contains(e.target)) {
                listContainer.classList.add('hidden');
            }
        });
    }

    setupAutocomplete(originInput, selectedOrigin);
    setupAutocomplete(destInput, selectedDest);
    setupAutocomplete(exCityInput, null);


    // --- Helper: UUID Generator for Session/Package IDs ---
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // --- Form Submission & URL Generation ---
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Default fallback if not selected
            const originCode = selectedOrigin.code || 'KUL';
            const destCode = selectedDest.code || 'PEN'; // Changed default to PEN to match known working ID

            // Dates fallback (next week default if empty)
            let startDate = datesInput.dataset.startDate;
            let endDate = datesInput.dataset.endDate;
            if (!startDate || !endDate) {
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                const weekAfter = new Date(nextWeek);
                weekAfter.setDate(nextWeek.getDate() + 3);
                startDate = formatDate(nextWeek);
                endDate = formatDate(weekAfter);
            }

            // Cabin Class Normalization
            let cabinClass = cabinInput ? cabinInput.value : 'Economy';
            const cabinMap = {
                'Economy': 'Economy', // Changed to Title Case to match working URL logic
                'Premium Economy': 'premium_economy',
                'Business': 'business',
                'First': 'first'
            };
            if (cabinMap[cabinClass]) cabinClass = cabinMap[cabinClass];

            // Trip Type Logic
            // Note: Bundle search currently enforces round trip
            const isRoundTrip = true;

            // Travelers parsing
            const travelersObj = [];
            // Distribute adults
            for (let i = 0; i < travelersState.adults; i++) {
                travelersObj.push({
                    "type": "adult",
                    "age": 12, // Changed to 12 to match working URL
                    "room": (i % travelersState.rooms) + 1
                });
            }
            // Distribute children
            for (let i = 0; i < travelersState.children; i++) {
                travelersObj.push({
                    "type": "child",
                    "age": 10,
                    "room": (i % travelersState.rooms) + 1
                });
            }
            const travelersEncoded = encodeURIComponent(JSON.stringify(travelersObj));

            // Expectations JSON
            const expectationObj = {
                "fl_cabin_class": cabinClass,
                "fl_departure_date": startDate,
                "fl_return_date": endDate,
                "fl_round_trip": isRoundTrip,
                "start_place_code": originCode,
                "start_place_type": "airport_code",
                "des_code": destCode,
                "des_type": "airport_code",
                "ht_des_code": destCode, // Default to destination
                "ht_des_type": "airport_code",
                "ht_checkin_date": startDate,
                "ht_checkout_date": endDate,
                "is_separate": false,
                "stars": null
            };

            // If partial hotel check is checked
            const isSeparate = checkbox ? checkbox.checked : false;
            if (isSeparate) {
                expectationObj.is_separate = true;
                // Update dates if specific ones selected
                if (exCheckinInput.dataset.date) expectationObj.ht_checkin_date = exCheckinInput.dataset.date;
                if (exCheckoutInput.dataset.date) expectationObj.ht_checkout_date = exCheckoutInput.dataset.date;
                // Note: ht_des_code would stay destCode unless we have logic to geocode the city input
            }

            const expectationEncoded = encodeURIComponent(JSON.stringify(expectationObj));

            // Other Params
            // package_id must be a valid bundle configuration ID, not random.
            const packageId = 'aaa34775-f480-477c-a656-f7a9a07ce605';
            const sessionId = '5f3fb160953e443f99c507bc1f73b727';

            // Using valid fallback ID for demo purposes (PEN/Penang)
            const placeId = '5129552';

            // Construct URL
            const baseUrl = `https://demo.apps.easygds.com/shopping/processes/bundle`;
            const queryParams = [
                `process=bundle`,
                `place_type=airport`,
                `place_id=${placeId}`,
                `currency_code=EUR`, // Changed to EUR to match known working URL
                `language_code=en-US`,
                `package_id=${packageId}`,
                `travelers=${travelersEncoded}`,
                `is_separate=${isSeparate}`,
                `expectation=${expectationEncoded}`,
                `disabled_currency=true`,
                `session_id=${sessionId}`,
                `office_domain=demo.b2c.easygds.com`, // Changed domain
                `scope_type=B2C`
            ].join('&');


            const fullUrl = `${baseUrl}?${queryParams}`;

            console.log('Redirecting to:', fullUrl);
            window.location.href = fullUrl;
        });
    }
});
