import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
    id: number;
    title: string;
    event_date: string;
    description: string;
};

type EventForm = {
    title: string;
    event_date: string;
    description: string;
};

export default function CalendarPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [form, setForm] = useState<EventForm>({
        title: "",
        event_date: new Date().toISOString().split('T')[0],
        description: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEventDetails, setShowEventDetails] = useState(false);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/events");
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await fetch("http://localhost:8000/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setForm({ title: "", event_date: selectedDate, description: "" });
            setShowModal(false);
            fetchEvents();
        } catch (error) {
            console.error("Error adding event:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this event?")) {
            setIsLoading(true);
            try {
                await fetch(`http://localhost:8000/events/${id}`, {
                    method: "DELETE",
                });
                setShowEventDetails(false);
                fetchEvents();
            } catch (error) {
                console.error("Error deleting event:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setForm(prev => ({ ...prev, event_date: date }));
        setShowModal(true);
    };

    const handleViewEvent = (event: Event) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const daysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();
        const daysCount = daysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];
        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border bg-gray-50"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysCount; day++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.event_date === date);
            const isToday = date === new Date().toISOString().split('T')[0];
            const isSelected = date === selectedDate;

            days.push(
                <div
                    key={day}
                    className={`h-24 border relative cursor-pointer hover:bg-blue-50 transition-colors duration-200 overflow-hidden ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleDateClick(date)}
                >
                    <div className="p-1">
                        <span className={`text-sm ${isToday ? 'font-bold text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                            {day}
                        </span>
                    </div>
                    <div className="px-1 max-h-16 overflow-y-auto">
                        {dayEvents.map((event, idx) => (
                            <div
                                key={idx}
                                className="text-xs mb-1 p-1 rounded bg-blue-100 text-blue-800 truncate hover:bg-blue-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewEvent(event);
                                }}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    // Get month name and year
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    // Get events for list view (upcoming events)
    const upcomingEvents = [...events]
        .filter(event => new Date(event.event_date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 5);  // Show only next 5 events

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">
            {/* Sidebar with improved styling */}
            <aside className="w-72 bg-white shadow-md flex flex-col justify-between fixed h-screen">
                {/* Sidebar header */}
                <div>
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                            <span className="text-3xl">🏫</span> SchoolSys
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Administration Portal</p>
                    </div>

                    {/* Navigation links with active state */}
                    <nav className="p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 pl-4">Main Menu</p>
                        <div className="space-y-1">
                            <Link
                                href="/dashborad"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">📊</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/students"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">🎓</span>
                                <span>Student Management</span>
                            </Link>
                            <Link
                                href="/teachers"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">👩‍🏫</span>
                                <span>Teacher Management</span>
                            </Link>
                            <Link
                                href="/calendar"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 bg-blue-50 text-blue-600 font-medium"
                            >
                                <span className="mr-3 text-xl">📅</span>
                                <span>School Calendar</span>
                            </Link>
                            {/* <Link
                                href="/courses"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">📚</span>
                                <span>Course Planning</span>
                            </Link> */}
                            {/* <Link
                                href="/reports"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">📈</span>
                                <span>Reports & Analytics</span>
                            </Link> */}
                        </div>
                    </nav>
                </div>

                {/* Sidebar footer */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-blue-50">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                            👤
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Principal Umesha</p>
                            <p className="text-xs text-gray-500">principal@schoolsys.edu</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">© 2025 SchoolSys</p>
                </div>
            </aside>

            {/* Main Content with left padding to account for fixed sidebar */}
            <main className="flex-1 p-8 ml-72">
                {/* Header with breadcrumbs and page title */}
                <div className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">School Calendar</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-700">📅 School Calendar</h1>
                        <button
                            onClick={() => handleDateClick(new Date().toISOString().split('T')[0])}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
                        >
                            <span className="mr-2">➕ Add New Event</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Calendar Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Calendar Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div className="flex items-center">
                                    <h2 className="text-xl font-semibold">{monthName} {year}</h2>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={goToToday}
                                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={prevMonth}
                                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                                    >
                                        ◀
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                                    >
                                        ▶
                                    </button>
                                </div>
                            </div>

                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 bg-blue-50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                    <div key={index} className="text-center py-2 font-medium text-sm text-blue-800">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7">
                                {renderCalendar()}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md h-full">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold">🗓️ Upcoming Events</h2>
                            </div>
                            <div className="p-4">
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="text-gray-500">Loading events...</div>
                                    </div>
                                ) : upcomingEvents.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500">
                                        No upcoming events scheduled
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {upcomingEvents.map((event) => (
                                            <li
                                                key={event.id}
                                                className="border-l-4 border-blue-500 pl-3 py-2 hover:bg-blue-50 rounded-r-lg cursor-pointer transition-colors"
                                                onClick={() => handleViewEvent(event)}
                                            >
                                                <p className="font-medium text-gray-800">{event.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(event.event_date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800">Add New Event</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter event title"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Event Date</label>
                                <input
                                    type="date"
                                    name="event_date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.event_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Enter event description"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    rows={3}
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {isLoading ? "Adding..." : "Add Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            {showEventDetails && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
                            <button
                                onClick={() => setShowEventDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold mb-1">{selectedEvent.title}</h4>
                                <p className="text-gray-500">
                                    {new Date(selectedEvent.event_date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-gray-800">{selectedEvent.description}</p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => handleDelete(selectedEvent.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete Event
                                </button>
                                <button
                                    onClick={() => setShowEventDetails(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}