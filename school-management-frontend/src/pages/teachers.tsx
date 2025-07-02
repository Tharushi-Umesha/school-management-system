import { useEffect, useState } from "react";
import Link from "next/link";

// Types
type Teacher = {
    id: number;
    name: string;
    subject: string;
    email: string;
    phone: string;
};

type TeacherForm = Omit<Teacher, "id">;

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [form, setForm] = useState<TeacherForm>({
        name: "",
        subject: "",
        email: "",
        phone: "",
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [formVisible, setFormVisible] = useState(false);

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/teachers");
            const data = await res.json();
            setTeachers(data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editId
                ? `http://localhost:8000/teachers/${editId}`
                : "http://localhost:8000/teachers";
            const method = editId ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            setForm({ name: "", subject: "", email: "", phone: "" });
            setEditId(null);
            setFormVisible(false);
            fetchTeachers();
        } catch (error) {
            console.error("Error saving teacher:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (teacher: Teacher) => {
        setForm({
            name: teacher.name,
            subject: teacher.subject,
            email: teacher.email,
            phone: teacher.phone,
        });
        setEditId(teacher.id);
        setFormVisible(true);

        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this teacher?")) {
            setIsLoading(true);
            try {
                await fetch(`http://localhost:8000/teachers/${id}`, {
                    method: "DELETE",
                });
                fetchTeachers();
            } catch (error) {
                console.error("Error deleting teacher:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCancel = () => {
        setForm({ name: "", subject: "", email: "", phone: "" });
        setEditId(null);
        setFormVisible(false);
    };

    // Filter teachers based on search
    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 bg-blue-50 text-blue-600 font-medium"
                            >
                                <span className="mr-3 text-xl">👩‍🏫</span>
                                <span>Teacher Management</span>
                            </Link>
                            <Link
                                href="/calendar"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
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
                        <span className="text-gray-700">Teacher Management</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-700">👩‍🏫 Teacher Management</h1>
                        <button
                            onClick={() => setFormVisible(!formVisible)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
                        >
                            <span className="mr-2">{formVisible ? "Cancel" : "➕ Add New Teacher"}</span>
                        </button>
                    </div>
                </div>

                {/* Add/Edit Teacher Form */}
                {formVisible && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-4xl transition-all duration-300 ease-in-out">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editId ? "✏️ Edit Teacher Information" : "➕ Add New Teacher"}
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Enter subject"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter teacher email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                >
                                    {isLoading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <span>{editId ? "Update Teacher" : "Add Teacher"}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Teacher List */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">📋 All Teachers</h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search teachers..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-8 flex justify-center">
                                <div className="text-gray-500">Loading teachers...</div>
                            </div>
                        ) : filteredTeachers.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                {searchTerm ? "No teachers match your search" : "No teachers found. Add your first teacher!"}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="text-left bg-gray-50 border-y border-gray-100">
                                            <th className="px-4 py-3 text-gray-700 font-semibold">Name</th>
                                            <th className="px-4 py-3 text-gray-700 font-semibold">Subject</th>
                                            <th className="px-4 py-3 text-gray-700 font-semibold">Email</th>
                                            <th className="px-4 py-3 text-gray-700 font-semibold">Phone</th>
                                            <th className="px-4 py-3 text-gray-700 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachers.map((teacher) => (
                                            <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-4 py-4 font-medium text-gray-800">{teacher.name}</td>
                                                <td className="px-4 py-4 text-gray-600">{teacher.subject}</td>
                                                <td className="px-4 py-4 text-gray-600">{teacher.email}</td>
                                                <td className="px-4 py-4 text-gray-600">{teacher.phone}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            onClick={() => handleEdit(teacher)}
                                                            className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:underline transition"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(teacher.id)}
                                                            className="px-3 py-1 text-red-500 hover:text-red-700 hover:underline transition"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                            <span>Showing {filteredTeachers.length} of {teachers.length} teachers</span>
                            <div className="flex space-x-1">
                                <button disabled className="px-3 py-1 rounded border border-gray-200 bg-gray-50">1</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}