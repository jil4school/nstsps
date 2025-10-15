import NST from "./assets/NST.png";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { Icon } from "@iconify/react";
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "./context/login-context";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForgotPassword } from "./context/forgot-password-context";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

function LandingPage() {
  const { login, error } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await login(values.email, values.password);

    if (success) {
      const role = localStorage.getItem("role");

      if (role) {
        navigate(`/nstsps/${role}-home`);
      } else {
        toast.error("Role not found for user"); // ✅ keep this one
      }
    }
  }

  const {
    showModal,
    openModal,
    closeModal,
    step,
    email,
    setEmail,
    sendVerification,
    verifyCode,
    countdown,
    resendCode,
    changePassword,
  } = useForgotPassword();
  const [codeInputs, setCodeInputs] = useState<string[]>(Array(6).fill(""));
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { setIsForgotPasswordOpen } = useLogin(); // add this

  const openModalHandler = () => {
    setIsForgotPasswordOpen(true);
    openModal();
  };

  const closeModalHandler = () => {
    setIsForgotPasswordOpen(false);
    closeModal();
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center h-screen w-screen bg-white">
        <img
          className="sm:w-[200px] md:w-[300px] lg:w-[500px] xl:w-[605px]"
          src={NST}
          alt="NST Logo"
          style={{
            boxShadow: "-8px 8px 10px rgba(0, 0, 0, 0.25)",
          }}
        />

        <div
          className="w-[200px] sm:w-[100px] md:w-[150px] lg:w-[200px] xl:w-[306px] h-[374px] sm:h-[124px] md:h-[185px] lg:h-[309px] xl:h-[374px] flex-col items-center p-15 "
          style={{ background: "#1BB2EF" }}
        >
          <span className="my-class text-white mb-3 block">User Login</span>

          <div className="relative w-full mb-3">
            <div className="relative w-full mb-7">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }}
                  className="grid gap-4"
                >
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      width={20}
                      height={20}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5m-4 9.5A3.75 3.75 0 0 0 4.25 17v1.188c0 .754.546 1.396 1.29 1.517c4.278.699 8.642.699 12.92 0a1.54 1.54 0 0 0 1.29-1.517V17A3.75 3.75 0 0 0 16 13.25h-.34q-.28.001-.544.086l-.866.283a7.25 7.25 0 0 1-4.5 0l-.866-.283a1.8 1.8 0 0 0-.543-.086z" />
                    </svg>{" "}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="nst email..."
                              className="pl-10 bg-white h-[45px] border-0 focus:border-0 focus:ring-0 focus:outline-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="relative">
                    <Icon
                      icon="mdi:password"
                      width="20"
                      height="20"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="password..."
                              className="pl-10 bg-white h-[45px] border-0 focus:border-0 focus:ring-0 focus:outline-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-center mb-3">
                    <Button
                      type="submit"
                      className="text-white hover:opacity-70 cursor-pointer"
                      style={{ background: "#0F88B6" }}
                    >
                      Login
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="link"
              style={{ color: "#919090" }}
              onClick={openModalHandler}
            >
              Forgot Password?
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <Dialog open={showModal} onOpenChange={closeModalHandler}>
          <DialogContent className="w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle>
                {step === "email" && "Forgot Password"}
                {step === "verify" && "Enter Verification Code"}
                {step === "changePassword" && "Change Password"}
              </DialogTitle>
            </DialogHeader>

            {/* Dialog Body */}
            {step === "email" && (
              <>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your NST email"
                />
                <Button
                  className="mt-4 bg-[#1BB2EF] text-white"
                  onClick={sendVerification}
                >
                  Send Verification Code
                </Button>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="flex justify-between gap-2 mb-2">
                  {codeInputs.map((val, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={val}
                      className="w-12 h-12 text-center border rounded"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/, "");
                        const newInputs = [...codeInputs];
                        newInputs[i] = val;
                        setCodeInputs(newInputs);

                        if (val && i < 5) {
                          const nextInput = document.getElementById(
                            `code-${i + 1}`
                          ) as HTMLInputElement;
                          nextInput?.focus();
                        }

                        if (newInputs.every((c) => c !== "")) {
                          verifyCode(newInputs.join(""));
                        }
                      }}
                      id={`code-${i}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Resend code in: {countdown}s
                </p>
                {countdown === 0 && (
                  <Button onClick={resendCode}>Resend Verification</Button>
                )}
              </>
            )}

            {step === "changePassword" && (
              <>
                <Input
                  type="password"
                  placeholder="New Password"
                  className="mb-2"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="mb-2"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
                <Button
                  onClick={() => changePassword(newPass, confirmPass)}
                  className="mt-2 bg-[#1BB2EF] text-white"
                >
                  Change Password
                </Button>
              </>
            )}

            <DialogFooter>
              <Button variant="link" onClick={closeModal}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export default LandingPage;
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { useEffect, useState } from "react";
// import { useProgram } from "./context/miscellaneous-context";
// import { toast } from "sonner";
// import axios from "axios";

// export default function WeeklySchedulingPage() {
//   const daysOfWeek = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];
//   const {
//     programs,
//     programCourses,
//     fetchPrograms,
//     fetchFilteredProgramCourses,
//   } = useProgram();

//   const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
//   const semesters = ["First Semester", "Second Semester"];

//   const timeSlots = [
//     "7:00–7:30",
//     "7:30–8:00",
//     "8:00–8:30",
//     "8:30–9:00",
//     "9:00–9:30",
//     "9:30–10:00",
//     "10:00–10:30",
//     "10:30–11:00",
//     "11:00–11:30",
//     "11:30–12:00",
//     "12:00–12:30",
//     "12:30–13:00",
//     "13:00–13:30",
//     "13:30–14:00",
//     "14:00–14:30",
//     "14:30–15:00",
//     "15:00–15:30",
//     "15:30–16:00",
//     "16:00–16:30",
//     "16:30–17:00",
//     "17:00–17:30",
//     "17:30–18:00",
//     "18:00–18:30",
//     "18:30–19:00",
//   ];

//   type Schedule = {
//     title: string;
//     start: string;
//     end: string;
//     day: string;
//   };
//   const [schoolYearFrom, setSchoolYearFrom] = useState("2024");
//   const [schoolYearTo, setSchoolYearTo] = useState("2025");

//   const [program, setProgram] = useState<string>(""); // ✅ now dynamic
//   const [yearLevel, setYearLevel] = useState(yearLevels[0]);
//   const [semester, setSemester] = useState(semesters[0]);
//   const [open, setOpen] = useState(false);
//   // inside your component
//   const [schedule, setSchedule] = useState({
//     course_id: "",
//     title: "",
//     start: "",
//     end: "",
//     day: "Monday",
//   });

//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   // ✅ Fetch programs on mount
//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   // ✅ Auto-select first program if available
//   useEffect(() => {
//     if (programs.length > 0 && !program) {
//       setProgram(programs[0].program_id);
//     }
//   }, [programs]);
//   useEffect(() => {
//     if (open && program && yearLevel && semester) {
//       const semFormatted =
//         semester === "First Semester" ? "First Semester" : "Second Semester";
//       fetchFilteredProgramCourses(program, yearLevel, semFormatted);
//     }
//   }, [open]);

//   function timeToMinutes(t: string) {
//     if (!t) return 0;
//     // normalize EN DASH, whitespace, etc.
//     t = t.replace("–", "-").trim().toUpperCase();

//     // if time has AM/PM (from TimeSelector) → handle normally
//     let [time, period] = t.split(/(AM|PM)/).filter(Boolean);
//     let [h, m] = time.split(":").map(Number);

//     if (period === "PM" && h !== 12) h += 12;
//     if (period === "AM" && h === 12) h = 0;

//     // if no AM/PM → assume 24-hour format
//     if (!period && h < 7) h += 12; // assume PM for 13:00+, AM for 7:00
//     return h * 60 + (m || 0);
//   }

//   const getScheduleForSlot = (day: string, slot: string) => {
//     // normalize en dash and parse both ends
//     const [slotStartRaw, slotEndRaw] = slot.replace("–", "-").split("-");
//     const slotStart = timeToMinutes(slotStartRaw);
//     const slotEnd = timeToMinutes(slotEndRaw);

//     return schedules.find((s) => {
//       if (s.day !== day) return false;
//       const schedStart = timeToMinutes(s.start);
//       const schedEnd = timeToMinutes(s.end);
//       return slotStart >= schedStart && slotStart < schedEnd;
//     });
//   };

//   const addSchedule = () => {
//     // find the selected course info using its course_id
//     const selectedCourse = programCourses.find(
//       (c) => String(c.course_id) === String(schedule.course_id)
//     );

//     // assign the course_description as title
//     const courseTitle = selectedCourse
//       ? selectedCourse.course_description
//       : "Untitled Course";

//     const newSchedule = {
//       ...schedule,
//       title: courseTitle, // ✅ auto-fill from course_description
//     };

//     const newStart = timeToMinutes(newSchedule.start);
//     const newEnd = timeToMinutes(newSchedule.end);

//     const overlap = schedules.find((s) => {
//       if (s.day !== newSchedule.day) return false;
//       const sStart = timeToMinutes(s.start);
//       const sEnd = timeToMinutes(s.end);
//       return newStart < sEnd && newEnd > sStart;
//     });

//     if (overlap) {
//       const confirmReplace = window.confirm(
//         `A schedule (${overlap.title}) already exists during this time.\nDo you want to replace it?`
//       );
//       if (!confirmReplace) return;
//       setSchedules((prev) =>
//         prev.filter(
//           (s) =>
//             !(
//               s.day === newSchedule.day &&
//               timeToMinutes(s.start) === timeToMinutes(overlap.start) &&
//               timeToMinutes(s.end) === timeToMinutes(overlap.end)
//             )
//         )
//       );
//     }

//     setSchedules((prev) => [...prev, newSchedule]);
//     setOpen(false);
//     setSchedule({
//       title: "",
//       start: "",
//       end: "",
//       day: "Monday",
//       course_id: "",
//     });
//   };

//   const isFirstSlotOfSchedule = (day: string, slot: string, schedule: any) => {
//     const slotStart = timeToMinutes(slot.split("–")[0]); // normalize
//     const schedStart = timeToMinutes(schedule.start);
//     return day === schedule.day && Math.abs(slotStart - schedStart) < 1;
//   };

//   const handleSubmit = async () => {
//     const schoolYear = `${schoolYearFrom}-${schoolYearTo}`;

//     // ✅ Only include course_id, start, end, and day in final payload
//     const cleanedSchedules = schedules.map(
//       ({ course_id, start, end, day, title }) => ({
//         course_id,
//         start,
//         end,
//         day,
//         title, // include the course title
//       })
//     );

//     const payload = {
//       action: "insert_schedule",
//       program_id: program,
//       year_level: yearLevel,
//       semester,
//       school_year: schoolYear,
//       schedules: cleanedSchedules, // ✅ use cleaned array
//     };

//     const confirm = window.confirm(
//       "Are you sure you want to submit this schedule?"
//     );
//     if (!confirm) return;

//     try {
//       const response = await axios.post(
//         "http://localhost/NSTSPS_API/controller/ScheduleController.php",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success(
//           response.data.message || "Schedule inserted successfully!"
//         );
//         console.log("✅ Response:", response.data);
//       } else {
//         toast.error(response.data.error || "Failed to insert schedule");
//         console.error("❌ Error:", response.data);
//       }
//     } catch (err: any) {
//       const message =
//         err.response?.data?.error ?? err.message ?? "Schedule insertion failed";
//       toast.error(message);
//       console.error("❌ Axios Error:", message);
//     }
//   };

//   return (
//     <div className="p-6 space-y-5">
//       <h1 className="text-2xl font-semibold text-center">Add New Schedule</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//         {/* Program */}
//         <div>
//           <Label>Program</Label>
//           <select
//             className="border rounded-md px-3 py-2 w-full"
//             value={program}
//             onChange={(e) => setProgram(e.target.value)}
//           >
//             {programs.map((p) => (
//               <option key={p.program_id} value={p.program_id}>
//                 {p.program_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Year Level */}
//         <div>
//           <Label>Year Level</Label>
//           <select
//             className="border rounded-md px-3 py-2 w-full"
//             value={yearLevel}
//             onChange={(e) => setYearLevel(e.target.value)}
//           >
//             {yearLevels.map((y) => (
//               <option key={y}>{y}</option>
//             ))}
//           </select>
//         </div>

//         {/* Semester */}
//         <div>
//           <Label>Semester</Label>
//           <select
//             className="border rounded-md px-3 py-2 w-full"
//             value={semester}
//             onChange={(e) => setSemester(e.target.value)}
//           >
//             {semesters.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>
//         </div>

//         {/* School Year */}
//         <div>
//           <Label>School Year</Label>
//           <div className="flex items-center gap-2">
//             <input
//               type="number"
//               className="border rounded-md px-2 py-2 w-20 text-center"
//               value={schoolYearFrom}
//               onChange={(e) => setSchoolYearFrom(e.target.value)}
//             />
//             <span>–</span>
//             <input
//               type="number"
//               className="border rounded-md px-2 py-2 w-20 text-center"
//               value={schoolYearTo}
//               onChange={(e) => setSchoolYearTo(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Add Button */}
//       <div className="flex justify-end">
//         <Button
//           onClick={() => {
//             setSchedule({
//               title: "",
//               start: "",
//               end: "",
//               day: "Monday",
//             });
//             setOpen(true);
//           }}
//         >
//           + Add Schedule
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="border rounded-xl overflow-auto">
//         <table className="w-full border-collapse min-w-[800px] text-center">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 border-b w-32 text-left">Time</th>
//               {daysOfWeek.map((day) => (
//                 <th key={day} className="p-3 border-b">
//                   {day}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {timeSlots.map((slot, i) => (
//               <tr key={i} className="hover:bg-gray-50">
//                 <td className="p-3 border-b text-left">{slot}</td>
//                 {daysOfWeek.map((day) => {
//                   const match = getScheduleForSlot(day, slot);
//                   return (
//                     <td key={day} className="p-3 border-b">
//                       {match ? (
//                         isFirstSlotOfSchedule(day, slot, match) ? (
//                           <span className="font-medium">{match.title}</span> // ✅ will show even 7:00–19:00
//                         ) : (
//                           <span className="text-gray-500 italic">-do-</span>
//                         )
//                       ) : (
//                         <span className="text-gray-400 italic">Free</span>
//                       )}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-end">
//         <Button className="mt-3" onClick={handleSubmit}>
//           Submit Schedule
//         </Button>
//       </div>

//       {/* Add Schedule Dialog */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="bg-white">
//           <DialogHeader>
//             <DialogTitle>Add Schedule</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-3">
//             <div>
//               <Label>Course/Subject</Label>
//               <select
//                 className="border rounded-md px-3 py-2 w-full"
//                 value={schedule.course_id || ""}
//                 onChange={(e) =>
//                   setSchedule({ ...schedule, course_id: e.target.value })
//                 }
//               >
//                 <option value="">Select a course</option>
//                 {programCourses.map((c) => (
//                   <option key={c.course_id} value={c.course_id}>
//                     {c.course_description}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <Label>Day</Label>
//               <select
//                 className="border rounded-md px-3 py-2 w-full"
//                 value={schedule.day}
//                 onChange={(e) =>
//                   setSchedule({ ...schedule, day: e.target.value })
//                 }
//               >
//                 {daysOfWeek.map((day) => (
//                   <option key={day} value={day}>
//                     {day}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Time selectors */}
//             <div className="flex gap-2">
//               <div className="flex-1">
//                 <Label>Start Time</Label>
//                 <TimeSelector
//                   value={schedule.start}
//                   onChange={(val) => setSchedule({ ...schedule, start: val })}
//                 />
//               </div>
//               <div className="flex-1">
//                 <Label>End Time</Label>
//                 <TimeSelector
//                   value={schedule.end}
//                   onChange={(val) => setSchedule({ ...schedule, end: val })}
//                 />
//               </div>
//             </div>

//             <Button className="w-full mt-2" onClick={addSchedule}>
//               Save
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// function TimeSelector({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (val: string) => void;
// }) {
//   const hours = Array.from({ length: 12 }, (_, i) => i + 1);
//   const minutes = ["00", "30"];
//   const periods = ["AM", "PM"];

//   const [h, setH] = useState("7");
//   const [m, setM] = useState("00");
//   const [p, setP] = useState("AM");

//   // ✅ Always send an initial value on mount
//   useEffect(() => {
//     const hour24 =
//       p === "PM" && h !== "12"
//         ? String(Number(h) + 12)
//         : p === "AM" && h === "12"
//         ? "00"
//         : String(h).padStart(2, "0");
//     onChange(`${hour24}:${m}`);
//   }, []);

//   const updateValue = (newH = h, newM = m, newP = p) => {
//     const hour24 =
//       newP === "PM" && newH !== "12"
//         ? String(Number(newH) + 12)
//         : newP === "AM" && newH === "12"
//         ? "00"
//         : String(newH).padStart(2, "0");
//     onChange(`${hour24}:${newM}`);
//   };

//   const handleHourChange = (val: string) => {
//     const hourNum = Number(val);
//     let newPeriod = p;

//     if (hourNum >= 12 || (hourNum >= 1 && hourNum <= 6)) newPeriod = "PM";
//     else newPeriod = "AM";

//     setH(val);
//     setP(newPeriod);
//     updateValue(val, m, newPeriod);
//   };

//   return (
//     <div className="flex gap-2">
//       <select
//         className="border rounded-md px-2 py-1 flex-1"
//         value={h}
//         onChange={(e) => handleHourChange(e.target.value)}
//       >
//         {hours.map((hr) => (
//           <option key={hr}>{hr}</option>
//         ))}
//       </select>

//       <select
//         className="border rounded-md px-2 py-1 flex-1"
//         value={m}
//         onChange={(e) => {
//           setM(e.target.value);
//           updateValue(h, e.target.value, p);
//         }}
//       >
//         {minutes.map((min) => (
//           <option key={min}>{min}</option>
//         ))}
//       </select>

//       <select
//         className="border rounded-md px-2 py-1 flex-1"
//         value={p}
//         onChange={(e) => {
//           setP(e.target.value);
//           updateValue(h, m, e.target.value);
//         }}
//       >
//         {periods.map((per) => (
//           <option key={per}>{per}</option>
//         ))}
//       </select>
//     </div>
//   );
// }
