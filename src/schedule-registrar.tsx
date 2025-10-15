import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useProgram } from "./context/miscellaneous-context";
import { toast } from "sonner";
import {
  AdminMasterFileProvider,
  useAdminMasterFile,
} from "./context/admin-master-file-context";

export function ScheduleContent() {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const {
    programs,
    programCourses,
    fetchPrograms,
    fetchFilteredProgramCourses,
  } = useProgram();

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["First Semester", "Second Semester"];

  const timeSlots = [
    "7:00–7:30",
    "7:30–8:00",
    "8:00–8:30",
    "8:30–9:00",
    "9:00–9:30",
    "9:30–10:00",
    "10:00–10:30",
    "10:30–11:00",
    "11:00–11:30",
    "11:30–12:00",
    "12:00–12:30",
    "12:30–13:00",
    "13:00–13:30",
    "13:30–14:00",
    "14:00–14:30",
    "14:30–15:00",
    "15:00–15:30",
    "15:30–16:00",
    "16:00–16:30",
    "16:30–17:00",
    "17:00–17:30",
    "17:30–18:00",
    "18:00–18:30",
    "18:30–19:00",
  ];

  type Schedule = {
    title: string;
    start: string;
    end: string;
    day: string;
  };
  const { insertSchedule, fetchSchedules } = useAdminMasterFile();

  const [schoolYearFrom, setSchoolYearFrom] = useState("2024");
  const [schoolYearTo, setSchoolYearTo] = useState("2025");

  const [program, setProgram] = useState<string>("");
  const [yearLevel, setYearLevel] = useState(yearLevels[0]);
  const [semester, setSemester] = useState(semesters[0]);
  const [open, setOpen] = useState(false);
  // inside your component
  const [schedule, setSchedule] = useState({
    course_id: "",
    title: "",
    start: "",
    end: "",
    day: "Monday",
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // ✅ Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  // ✅ Auto-select first program if available
  useEffect(() => {
    if (programs.length > 0 && !program) {
      setProgram(programs[0].program_id);
    }
  }, [programs]);
  useEffect(() => {
    if (open && program && yearLevel && semester) {
      const semFormatted =
        semester === "First Semester" ? "First Semester" : "Second Semester";
      fetchFilteredProgramCourses(program, yearLevel, semFormatted);
    }
  }, [open]);
  useEffect(() => {
    const loadSchedules = async () => {
      if (!program || !yearLevel || !semester) return;
      const schoolYear = `${schoolYearFrom}-${schoolYearTo}`;

      try {
        const data = await fetchSchedules(
          program,
          yearLevel,
          semester,
          schoolYear
        );
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((s) => ({
            title: s.course_description,
            start: s.start_time,
            end: s.end_time,
            day: s.day,
            course_id: s.course_id,
          }));
          setSchedules(mapped);
          console.log("Schedules loaded:", data);
        } else {
          setSchedules([]);
        }
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setSchedules([]);
      }
    };

    loadSchedules();
  }, [program, yearLevel, semester, schoolYearFrom, schoolYearTo]);

  function timeToMinutes(t: string) {
    if (!t) return 0;
    // Normalize all dash types and ensure HH:mm:ss or HH:mm format
    const clean = t.trim().replace(/[–-]/g, ":");
    const parts = clean.split(":").map(Number);
    const [h = 0, m = 0] = parts;
    return h * 60 + m;
  }

  const getScheduleForSlot = (day: string, slot: string) => {
    const [slotStartRaw] = slot.replace(/[–-]/g, "-").split("-");
    const slotStart = timeToMinutes(slotStartRaw);

    console.log("🕒 Checking slot:", slot, "for day:", day);
    console.log("📅 Available schedules:", schedules);

    const match = schedules.find((s) => {
      const schedDay = (s.day || "").trim().toLowerCase();
      const schedStart = timeToMinutes(s.start);
      const schedEnd = timeToMinutes(s.end);
      const slotDay = day.trim().toLowerCase();

      const isDayMatch = schedDay === slotDay;
      const isTimeMatch = slotStart >= schedStart && slotStart < schedEnd;

      console.log({
        slot,
        slotStart,
        schedDay,
        sStart: s.start,
        schedStart,
        sEnd: s.end,
        schedEnd,
        isDayMatch,
        isTimeMatch,
        course: s.title,
      });

      return isDayMatch && isTimeMatch;
    });

    return match;
  };

  const isFirstSlotOfSchedule = (day: string, slot: string, schedule: any) => {
    const slotStart = timeToMinutes(slot.split(/[–-]/)[0]);
    const schedStart = timeToMinutes(schedule.start);
    return (
      day.toLowerCase() === schedule.day.toLowerCase() &&
      Math.abs(slotStart - schedStart) < 1
    );
  };

  const addSchedule = () => {
    // find the selected course info using its course_id
    const selectedCourse = programCourses.find(
      (c) => String(c.course_id) === String(schedule.course_id)
    );

    // assign the course_description as title
    const courseTitle = selectedCourse
      ? selectedCourse.course_description
      : "Untitled Course";

    const newSchedule = {
      ...schedule,
      title: courseTitle, // ✅ auto-fill from course_description
    };

    const newStart = timeToMinutes(newSchedule.start);
    const newEnd = timeToMinutes(newSchedule.end);

    const overlap = schedules.find((s) => {
      if (s.day !== newSchedule.day) return false;
      const sStart = timeToMinutes(s.start);
      const sEnd = timeToMinutes(s.end);
      return newStart < sEnd && newEnd > sStart;
    });

    if (overlap) {
      const confirmReplace = window.confirm(
        `A schedule (${overlap.title}) already exists during this time.\nDo you want to replace it?`
      );
      if (!confirmReplace) return;
      setSchedules((prev) =>
        prev.filter(
          (s) =>
            !(
              s.day === newSchedule.day &&
              timeToMinutes(s.start) === timeToMinutes(overlap.start) &&
              timeToMinutes(s.end) === timeToMinutes(overlap.end)
            )
        )
      );
    }

    setSchedules((prev) => [...prev, newSchedule]);
    setOpen(false);
    setSchedule({
      title: "",
      start: "",
      end: "",
      day: "Monday",
      course_id: "",
    });
  };

  const handleSubmit = async () => {
    const schoolYear = `${schoolYearFrom}-${schoolYearTo}`;

    // ✅ Only include course_id, start, end, day, title
    const cleanedSchedules = schedules.map(
      ({ course_id, start, end, day, title }) => ({
        course_id,
        start,
        end,
        day,
        title,
      })
    );

    const payload = {
      program_id: program,
      year_level: yearLevel,
      semester,
      school_year: schoolYear,
      schedules: cleanedSchedules,
    };

    const confirm = window.confirm(
      "Are you sure you want to submit this schedule?"
    );
    if (!confirm) return;

    try {
      await insertSchedule(payload);
      toast.success("Schedule inserted successfully!");
    } catch (err: any) {
      console.error("Error inserting schedule:", err);
      toast.error("Failed to insert schedule");
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        {/* Program */}
        <div className="col-span-3">
          <Label className="mb-2">Program</Label>
          <select
            className="border rounded-md px-3 py-2 w-full"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          >
            {programs.map((p) => (
              <option key={p.program_id} value={p.program_id}>
                {p.program_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Level */}
        <div>
          <Label className="mb-2">Year Level</Label>
          <select
            className="border rounded-md px-3 py-2 w-full"
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
          >
            {yearLevels.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <Label className="mb-2">Semester</Label>
          <select
            className="border rounded-md px-3 py-2 w-full"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            {semesters.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* School Year */}
        <div>
          <Label className="mb-2">School Year</Label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="border rounded-md px-2 py-2 w-20 text-center"
              value={schoolYearFrom}
              onChange={(e) => setSchoolYearFrom(e.target.value)}
            />
            <span>–</span>
            <input
              type="number"
              className="border rounded-md px-2 py-2 w-20 text-center"
              value={schoolYearTo}
              onChange={(e) => setSchoolYearTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSchedule({
              title: "",
              start: "",
              end: "",
              day: "Monday",
              course_id: "",
            });
            setOpen(true);
          }}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Schedule
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-auto">
        <table className="w-full border-collapse min-w-[800px] text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b w-32 text-left">Time</th>
              {daysOfWeek.map((day) => (
                <th key={day} className="p-3 border-b">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-3 border-b text-left">{slot}</td>
                {daysOfWeek.map((day) => {
                  const match = getScheduleForSlot(day, slot);
                  return (
                    <td key={day} className="p-3 border-b">
                      {match ? (
                        isFirstSlotOfSchedule(day, slot, match) ? (
                          <span className="font-medium">{match.title}</span> // ✅ will show even 7:00–19:00
                        ) : (
                          <span className="text-gray-500 italic">-do-</span>
                        )
                      ) : (
                        <span className="text-gray-400 italic">Free</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 mt-3"
          onClick={handleSubmit}
        >
          Submit Schedule
        </Button>
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">Add Schedule</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label className="mb-2">Course/Subject</Label>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={schedule.course_id || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, course_id: e.target.value })
                }
              >
                <option value="">Select a course</option>
                {programCourses.map((c) => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.course_description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-2">Day</Label>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={schedule.day}
                onChange={(e) =>
                  setSchedule({ ...schedule, day: e.target.value })
                }
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Time selectors */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="mb-2">Start Time</Label>
                <TimeSelector
                  value={schedule.start}
                  onChange={(val) => setSchedule({ ...schedule, start: val })}
                />
              </div>
              <div className="flex-1">
                <Label className="mb-2">End Time</Label>
                <TimeSelector
                  value={schedule.end}
                  onChange={(val) => setSchedule({ ...schedule, end: val })}
                />
              </div>
            </div>

            <Button
              className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700"
              onClick={addSchedule}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TimeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "30"];
  const periods = ["AM", "PM"];

  const [h, setH] = useState("7");
  const [m, setM] = useState("00");
  const [p, setP] = useState("AM");

  // ✅ Always send an initial value on mount
  useEffect(() => {
    const hour24 =
      p === "PM" && h !== "12"
        ? String(Number(h) + 12)
        : p === "AM" && h === "12"
        ? "00"
        : String(h).padStart(2, "0");
    onChange(`${hour24}:${m}`);
  }, []);

  const updateValue = (newH = h, newM = m, newP = p) => {
    const hour24 =
      newP === "PM" && newH !== "12"
        ? String(Number(newH) + 12)
        : newP === "AM" && newH === "12"
        ? "00"
        : String(newH).padStart(2, "0");
    onChange(`${hour24}:${newM}`);
  };

  const handleHourChange = (val: string) => {
    const hourNum = Number(val);
    let newPeriod = p;

    if (hourNum >= 12 || (hourNum >= 1 && hourNum <= 6)) newPeriod = "PM";
    else newPeriod = "AM";

    setH(val);
    setP(newPeriod);
    updateValue(val, m, newPeriod);
  };

  return (
    <div className="flex gap-2">
      <select
        className="border rounded-md px-2 py-1 flex-1"
        value={h}
        onChange={(e) => handleHourChange(e.target.value)}
      >
        {hours.map((hr) => (
          <option key={hr}>{hr}</option>
        ))}
      </select>

      <select
        className="border rounded-md px-2 py-1 flex-1"
        value={m}
        onChange={(e) => {
          setM(e.target.value);
          updateValue(h, e.target.value, p);
        }}
      >
        {minutes.map((min) => (
          <option key={min}>{min}</option>
        ))}
      </select>

      <select
        className="border rounded-md px-2 py-1 flex-1"
        value={p}
        onChange={(e) => {
          setP(e.target.value);
          updateValue(h, m, e.target.value);
        }}
      >
        {periods.map((per) => (
          <option key={per}>{per}</option>
        ))}
      </select>
    </div>
  );
}
export default function SchedulingPage() {
  return (
    <AdminMasterFileProvider>
      <ScheduleContent />
    </AdminMasterFileProvider>
  );
}
