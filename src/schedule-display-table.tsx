import React from "react";

function ScheduleDisplayTable() {
  const schedules = [
    {
      schedule_id: 1,
      course_description: "The Contemporary World",
      course_id: 23,
      day: "Monday",
      start_time: "07:30:00",
      end_time: "10:00:00",
    },
    {
      schedule_id: 2,
      course_description: "Mathematics in the Modern World",
      course_id: 24,
      day: "Tuesday",
      start_time: "08:00:00",
      end_time: "11:00:00",
    },
    {
      schedule_id: 3,
      course_description: "Purposive Communication",
      course_id: 25,
      day: "Thursday",
      start_time: "13:00:00",
      end_time: "15:00:00",
    },
  ];

  // Generate 30-min time slots from 7:00 AM to 7:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    const start = new Date();
    start.setHours(7, 0, 0, 0);
    const end = new Date();
    end.setHours(19, 0, 0, 0);

    while (start < end) {
      const next = new Date(start.getTime() + 30 * 60000);
      const formatTime = (date) =>
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
  const getCellValue = (day, slot) => {
    const sched = schedules.find((s) => s.day === day);
    if (!sched) return "Free";

    const [sh, sm] = sched.start_time.split(":").map(Number);
    const [eh, em] = sched.end_time.split(":").map(Number);
    const schedStart = sh * 60 + sm;
    const schedEnd = eh * 60 + em;

    // If slot overlaps with the schedule
    if (slot.endTime > schedStart && slot.startTime < schedEnd) {
      // Exact start slot → subject name
      if (slot.startTime === schedStart) return sched.course_description;
      // Within schedule duration → "-do-"
      return "-do-";
    }

    return "Free";
  };

  return (
    <div className="overflow-x-auto shadow-lg border border-gray-300">
      <table className="min-w-full border-collapse text-center text-sm">
        <thead className="bg-gray-200 text-gray-700">
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

export default ScheduleDisplayTable;
