document.addEventListener('DOMContentLoaded', () => {
    const busSchedule = document.getElementById('busSchedule');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchForm = document.getElementById('searchForm');
    const startLocation = document.getElementById('startLocation');
    const endLocation = document.getElementById('endLocation');
    const desiredTime = document.getElementById('desiredTime');

    // Function to format arrival time
    const formatArrivalTime = (minutes) => {
        if (minutes === 0) return 'Arriving now';
        if (minutes === 1) return '1 minute away';
        return `${minutes} minutes away`;
    };

    // Function to create bus arrival element
    const createBusArrivalElement = (route, routeName, departure, arrival, minutes) => {
        const div = document.createElement('div');
        div.className = 'bus-arrival p-4 border-b border-gray-200 last:border-b-0';
        div.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-center gap-2">
                <div class="text-left">
                    <h3 class="font-semibold text-lg">Route ${route} - ${routeName}</h3>
                    <p class="text-gray-600">Departs: <span class="font-medium">${departure}</span></p>
                    <p class="text-gray-600">Arrives: <span class="font-medium">${arrival}</span></p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-purple-600">${formatArrivalTime(minutes)}</p>
                </div>
            </div>
        `;
        return div;
    };

    // Function to fetch bus schedule
    const fetchBusSchedule = async (params = {}) => {
        try {
            busSchedule.innerHTML = '<div class="loading p-4">Loading schedule...</div>';
            const query = new URLSearchParams(params).toString();
            const response = await fetch(`/api/schedule?${query}`);
            const data = await response.json();
            busSchedule.innerHTML = '';
            if (data.length === 0) {
                busSchedule.innerHTML = '<div class="p-4 text-gray-600">No buses found for your selection.</div>';
                return;
            }
            data.forEach(bus => {
                busSchedule.appendChild(
                    createBusArrivalElement(bus.route, bus.routeName, bus.departure, bus.arrival, bus.minutes)
                );
            });
        } catch (error) {
            busSchedule.innerHTML = `
                <div class="p-4 text-red-600">
                    Error loading schedule. Please try again.
                </div>
            `;
            console.error('Error:', error);
        }
    };

    // Initial load
    fetchBusSchedule();

    // Refresh button click handler
    refreshBtn.addEventListener('click', () => {
        fetchBusSchedule({
            start: startLocation.value,
            end: endLocation.value,
            time: desiredTime.value
        });
    });

    // Search form submit handler
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchBusSchedule({
            start: startLocation.value,
            end: endLocation.value,
            time: desiredTime.value
        });
    });

    // Auto-refresh every 30 seconds
    setInterval(() => {
        fetchBusSchedule({
            start: startLocation.value,
            end: endLocation.value,
            time: desiredTime.value
        });
    }, 30000);
}); 