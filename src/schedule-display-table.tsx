import React, { useEffect, useState } from "react";
import {
  AdminMasterFileProvider,
  useAdminMasterFile,
} from "./context/admin-master-file-context";
import { useLogin } from "./context/login-context";
import { useRegistrationContext } from "./context/registration-context";

interface Schedule {
  schedule_id: number;
  course_description: string;
  course_id: number;
  day: string;
  start_time: string;
  end_time: string;
}

function ScheduleDisplayTable() {
  const { registrations, getRegistrationById } = useRegistrationContext();

  const { fetchSchedules, fetchStudentById } = useAdminMasterFile();
  const { user } = useLogin();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user?.user_id) return;

      setLoading(true);
      try {
        const student = await fetchStudentById(String(user.user_id));
        if (!student) {
          console.warn("No student data found.");
          setSchedules([]);
          return;
        }

        // ✅ Use Registration Context instead of direct API call
        let latestReg = null;

        if (registrations.length > 0) {
          latestReg = registrations[registrations.length - 1];
        } else {
          const fetchedReg = await getRegistrationById(
            student.registration_id,
            student.master_file_id,
            student.user_id
          );
          latestReg = fetchedReg;
        }


        if (!latestReg) {
          console.warn("No registration record found for this student.");
          setSchedules([]);
          return;
        }

        const { program_id, year_level, sem, school_year } = latestReg;

        // ✅ Fetch schedule based on registration info
        // Ensure all parameters are strings to satisfy fetchSchedules signature
        const fetched = await fetchSchedules(
          String(program_id ?? ""),
          String(year_level ?? ""),
          String(sem ?? ""),
          String(school_year ?? "")
        );


        setSchedules(Array.isArray(fetched) ? fetched : []);
      } catch (err) {
        console.error("Error loading schedule:", err);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [user, registrations]);

  // Generate 30-min time slots from 7:00 AM to 7:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    const start = new Date();
    start.setHours(7, 0, 0, 0);
    const end = new Date();
    end.setHours(19, 0, 0, 0);

    while (start < end) {
      const next = new Date(start.getTime() + 30 * 60000);
      const formatTime = (date: Date) =>
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      slots.push({
        label: `${formatTime(start)}-${formatTime(next)}`,
        startTime: start.getHours() * 60 + start.getMinutes(),
        endTime: next.getHours() * 60 + next.getMinutes(),
      });
      start.setTime(next.getTime());
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Determine what to show for each cell
  const getCellValue = (
    day: string,
    slot: { startTime: number; endTime: number }
  ) => {
    const dailySchedules = schedules.filter((s) => s.day === day);
    if (dailySchedules.length === 0) return "";

    for (const sched of dailySchedules) {
      const [sh, sm] = sched.start_time.split(":").map(Number);
      const [eh, em] = sched.end_time.split(":").map(Number);
      const schedStart = sh * 60 + sm;
      const schedEnd = eh * 60 + em;

      if (slot.endTime > schedStart && slot.startTime < schedEnd) {
        if (slot.startTime === schedStart)
          return <span className="font-bold">{sched.course_description}</span>;
        return "-do-";
      }
    }

    return "";
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Loading schedule...</div>
    );

  return (
    <div className="overflow-x-auto shadow-lg border border-gray-300">
      <table className="min-w-full border-collapse text-center text-sm">
        <thead className="bg-[#1BB2EF] text-white sticky top-0">
          <tr>
            <th className="border px-3 py-2 w-32">Time</th>
            {days.map((day) => (
              <th key={day} className="border px-3 py-2 w-28">
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="border px-2 py-1 font-medium text-gray-700">
                {slot.label}
              </td>
              {days.map((day) => (
                <td key={day} className="border px-2 py-1">
                  {getCellValue(day, slot)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { ScheduleDisplayTable };

function StudentSchedulePage() {
  return (
    <AdminMasterFileProvider>
      <ScheduleDisplayTable />
    </AdminMasterFileProvider>
  );
}

export default StudentSchedulePage;
