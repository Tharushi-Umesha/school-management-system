import Link from "next/link";
import { useState, useEffect } from "react";

type Event = {
    id: number;
    title: string;
    event_date: string;
    description: string;
};





export default function Dashboard() {
    // Change null to number | null to fix the TypeScript error
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [studentCount, setStudentCount] = useState("...");
    const [eventCount, setEventCount] = useState("...");
    const [events, setEvents] = useState<Event[]>([]);
    const [attendanceRate, setAttendanceRate] = useState("...");


    useEffect(() => {
        const fetchStudentCount = async () => {
            try {
                const res = await fetch("http://localhost:8000/students/count");
                const data = await res.json();
                setStudentCount(data.count);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };

        fetchStudentCount();
    }, []);

    useEffect(() => {
        const fetchRate = async () => {
            const res = await fetch("http://localhost:8000/attendance/rate");
            const data = await res.json();
            setAttendanceRate(`${data.rate}%`);
        };
        fetchRate();
    }, []);

    const [teacherCount, setTeacherCount] = useState("...");

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const studentRes = await fetch("http://localhost:8000/students/count");
                const teacherRes = await fetch("http://localhost:8000/teachers/count");
                const studentData = await studentRes.json();
                const teacherData = await teacherRes.json();
                setStudentCount(studentData.count);
                setTeacherCount(teacherData.count);
            } catch (error) {
                console.error("Failed to fetch counts:", error);
            }
        };

        fetchCounts();
    }, []);

    useEffect(() => {
        const fetchCountsAndEvents = async () => {
            try {
                const [studentRes, teacherRes, eventCountRes, eventListRes] = await Promise.all([
                    fetch("http://localhost:8000/students/count"),
                    fetch("http://localhost:8000/teachers/count"),
                    fetch("http://localhost:8000/events/count"),
                    fetch("http://localhost:8000/events")
                ]);

                const studentData = await studentRes.json();
                const teacherData = await teacherRes.json();
                const eventCountData = await eventCountRes.json();
                const eventList = await eventListRes.json();

                setStudentCount(studentData.count);
                setTeacherCount(teacherData.count);
                setEventCount(eventCountData.count);
                if (Array.isArray(eventList)) {
                    setEvents(eventList.slice(0, 3)); // show only top 3 recent events
                }
            } catch (error) {
                console.error("Failed to fetch counts/events:", error);
            }
        };

        fetchCountsAndEvents();
    }, []);




    // Quick stats data
    const stats = [
        { label: "Total Students", value: studentCount, icon: "🧑‍🎓", color: "bg-blue-500" },
        { label: "Total Teachers", value: teacherCount, icon: "👩‍🏫", color: "bg-green-500" },
        // { label: "Attendance Rate", value: attendanceRate, icon: "📊", color: "bg-purple-500" },
        { label: "Upcoming Events", value: eventCount, icon: "📅", color: "bg-amber-500" }
    ];

    // Menu items
    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/students", label: "Student Management", icon: "🎓" },
        { href: "/teachers", label: "Teacher Management", icon: "👩‍🏫" },
        { href: "/calendar", label: "School Calendar", icon: "📅" },
        // { href: "/courses", label: "Course Planning", icon: "📚" },
        // { href: "/reports", label: "Reports & Analytics", icon: "📈" }
    ];

    // Quick action cards
    const quickActions = [
        { title: "Students", description: "Add, view, or update student records", icon: "🎓", href: "/students" },
        { title: "Teachers", description: "Manage teacher profiles and assignments", icon: "👩‍🏫", href: "/teachers" },
        { title: "Calendar", description: "View events, meetings, and holidays", icon: "📅", href: "/calendar" },
        // { title: "Attendance", description: "Track daily attendance records", icon: "✅", href: "/attendance" },
        // { title: "Grades", description: "Manage and review student grades", icon: "🏆", href: "/grades" },
        // { title: "Announcements", description: "Post important school announcements", icon: "📣", href: "/announcements" }
    ];


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
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 ${item.href === "/dashboard"
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-600 hover:text-blue-600"
                                        }`}
                                >
                                    <span className="mr-3 text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
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
                {/* Welcome banner with gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Welcome back, Principal Umesha! 👋</h2>
                            <p className="text-blue-100">
                                It&apos;s Monday, March 23, 2025 | Start of Spring Term
                            </p>
                        </div>
                        <div className="hidden md:block text-5xl">🎯</div>
                    </div>
                </div>

                {/* Stats overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md p-4 flex items-center hover:shadow-lg transition-all duration-200"
                        >
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mr-4`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick access section */}
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {quickActions.map((action, index) => (
                        <Link
                            href={action.href}
                            key={index}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:bg-blue-50 transition-all duration-200"
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="flex items-start">
                                <div className={`text-3xl ${hoveredCard === index ? 'scale-110' : ''} transition-transform duration-200`}>
                                    {action.icon}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h3>
                                    <p className="text-gray-500 text-sm">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Recent Activity</h3>
                        <button className="text-blue-500 text-sm font-medium hover:text-blue-600">View All</button>
                    </div>
                    <div className="space-y-4">
                        {events.map((event, i) => (
                            <div key={event.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3">
                                    📅
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium">{event.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(event.event_date).toDateString()}</p>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </main>
        </div>
    );
}