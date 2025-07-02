import { useEffect, useState } from "react";
import Link from "next/link";

type Student = {
    id: number;
    name: string;
    grade: string;
};

type AttendanceRecord = {
    student_id: number;
    date: string;
    status: "present" | "absent";
};

type GradeInfo = {
    grade: string;
    studentCount: number;
    icon: string;
};

export default function AttendancePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const today = new Date().toISOString().slice(0, 10);


    // Simple emoji icons for grades
    const gradeIcons: { [key: string]: string } = {
        "1st": "🔢", "2nd": "🔢", "3rd": "🔢", "4th": "🔢", "5th": "🔢",
        "6th": "🔢", "7th": "🔢", "8th": "🔢", "9th": "🔢", "10th": "🔢",
        "11th": "🔢", "12th": "🔢", "K": "🔢"
    };

    // Default icon
    const defaultIcon = "📚";
    useEffect(() => {
        // Reset attendance when the date changes (i.e., new day)
        setSelectedGrade(null);
        setAttendance([]);
    }, [today]);


    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/students");
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectGrade = (grade: string) => {
        setSelectedGrade(grade);

        // Initialize attendance records for all students in the grade
        const studentsInGrade = students.filter(s => s.grade === grade);
        const initialAttendance = studentsInGrade.map(student => ({
            student_id: student.id,
            date: today,
            status: "present" as const
        }));

        setAttendance(initialAttendance);
    };

    const handleStatusChange = (id: number, status: "present" | "absent") => {
        setAttendance(prev =>
            prev.map(record =>
                record.student_id === id ? { ...record, status } : record
            )
        );
    };

    const handleSubmit = async () => {
        if (attendance.length === 0) return;

        try {
            await fetch("http://localhost:8000/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(attendance),
            });
            alert("Attendance submitted successfully!");

            // Clear selected grade and attendance state
            setSelectedGrade(null);
            setAttendance([]);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            alert("Error submitting attendance. Please try again.");
        }
    };


    const handleBackToGrades = () => {
        setSelectedGrade(null);
        setAttendance([]);
    };

    // Get unique grades and count of students in each
    const gradeInfo: GradeInfo[] = Array.from(
        students.reduce((acc, student) => {
            const grade = student.grade;
            if (!acc.has(grade)) {
                acc.set(grade, {
                    grade,
                    studentCount: 1,
                    icon: gradeIcons[grade] || defaultIcon
                });
            } else {
                const current = acc.get(grade)!;
                acc.set(grade, {
                    ...current,
                    studentCount: current.studentCount + 1
                });
            }
            return acc;
        }, new Map<string, GradeInfo>())
    ).map(([_, info]) => info).sort((a, b) => a.grade.localeCompare(b.grade));

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">
            {/* Sidebar */}
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
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">📅</span>
                                <span>School Calendar</span>
                            </Link>
                            <Link
                                href="/attendance"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 bg-blue-50 text-blue-600 font-medium"
                            >
                                <span className="mr-3 text-xl">✅</span>
                                <span>Attendance</span>
                            </Link>
                            <Link
                                href="/courses"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">📚</span>
                                <span>Course Planning</span>
                            </Link>
                            <Link
                                href="/reports"
                                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            >
                                <span className="mr-3 text-xl">📈</span>
                                <span>Reports & Analytics</span>
                            </Link>
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

            {/* Main Content */}
            <main className="flex-1 p-8 ml-72">
                {/* Header with breadcrumbs and page title */}
                <div className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">Attendance Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-700">✅ Attendance Management</h1>
                </div>

                {isLoading ? (
                    <div className="bg-white p-12 rounded-xl shadow-md flex justify-center items-center">
                        <p className="text-gray-500">Loading attendance data...</p>
                    </div>
                ) : (
                    <>
                        {!selectedGrade ? (
                            /* Grade Selection View */
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-semibold mb-6">Select a Grade to Take Attendance</h2>

                                {gradeInfo.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No grades available. Please add students first.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {gradeInfo.map((info) => (
                                            <div
                                                key={info.grade}
                                                onClick={() => handleSelectGrade(info.grade)}
                                                className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer flex flex-col items-center"
                                            >
                                                <div className="text-4xl mb-3">{info.icon}</div>
                                                <h3 className="text-lg font-bold mb-1">Grade {info.grade}</h3>
                                                <p className="text-sm text-gray-600">{info.studentCount} students</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Attendance Taking View for Selected Grade */
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <button
                                            onClick={handleBackToGrades}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <span className="mr-1">←</span> Back to All Grades
                                        </button>
                                        <h2 className="text-xl font-semibold">
                                            Grade {selectedGrade} Attendance
                                        </h2>
                                        <p className="text-gray-500 text-sm">{today}</p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-y border-gray-100">
                                                    <th className="px-4 py-3 text-left">Student</th>
                                                    <th className="px-4 py-3 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students
                                                    .filter(student => student.grade === selectedGrade)
                                                    .map((student) => {
                                                        const record = attendance.find(a => a.student_id === student.id);
                                                        return (
                                                            <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center">
                                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold mr-3">
                                                                            {student.name.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">{student.name}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex justify-center">
                                                                        <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
                                                                            <button
                                                                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${record?.status === "present"
                                                                                    ? "bg-green-500 text-white"
                                                                                    : "bg-gray-100 text-gray-700 hover:bg-green-100"
                                                                                    }`}
                                                                                onClick={() => handleStatusChange(student.id, "present")}
                                                                            >
                                                                                Present
                                                                            </button>
                                                                            <button
                                                                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${record?.status === "absent"
                                                                                    ? "bg-red-500 text-white"
                                                                                    : "bg-gray-100 text-gray-700 hover:bg-red-100"
                                                                                    }`}
                                                                                onClick={() => handleStatusChange(student.id, "absent")}
                                                                            >
                                                                                Absent
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Submit button */}
                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={handleSubmit}
                                            className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                        >
                                            Submit Attendance
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}