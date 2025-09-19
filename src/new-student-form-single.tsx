import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMasterFile } from "./context/master-file-context";
import { useEffect, useState } from "react";
import { useProgram } from "@/context/miscellaneous-context";
import { toast } from "sonner";
import HeaderAdmin from "./header-admin";

const formSchema = z.object({
  student_id: z.string(),
  program_id: z.string(),
  year_level: z.string(),
  sem: z.string(),
  school_year: z.string(),
  registration_date: z.string(),
  surname: z.string(),
  first_name: z.string(),
  middle_name: z.string(),
  email: z.string(),
  gender: z.string(),
  nationality: z.string(),
  civil_status: z.string(),
  religion: z.string(),
  birthday: z.string(),
  birthplace: z.string(),
  street: z.string(),
  barangay: z.string(),
  region: z.string(),
  municipality: z.string(),
  mobile_number: z.string(),
  guardian_name: z.string(),
  guardian_surname: z.string(),
  guardian_first_name: z.string(),
  relation_with_the_student: z.string(),
  guardian_mobile_number: z.string(),
  guardian_email: z.string(),
});

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function NewStudentSingle() {
  const { programs, fetchPrograms } = useProgram();
  const { insertStudent } = useMasterFile();
  const onSubmit = async (values: any) => {
    const [surname = "", firstName = ""] = (values.guardian_name || "")
      .split(",")
      .map((str: string) => str.trim());

    try {
      const success = await insertStudent({
        ...values,
        guardian_surname: surname,
        guardian_first_name: firstName,
        user_id: null,
      });

      if (success) {
        toast.success("Student inserted successfully!");
      }
    } catch (error: any) {
      toast.error("Insert failed: " + (error?.message || "Unknown error"));
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: "",
      program_id: "",
      year_level: "",
      sem: "",
      school_year: "",
      registration_date: "",
      surname: "",
      first_name: "",
      middle_name: "",
      email: "",
      gender: "",
      nationality: "",
      civil_status: "",
      religion: "",
      birthday: "",
      birthplace: "",
      street: "",
      barangay: "",
      region: "",
      municipality: "",
      mobile_number: "",
      guardian_name: "",
      guardian_surname: "",
      guardian_first_name: "",
      relation_with_the_student: "",
      guardian_mobile_number: "",
      guardian_email: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date("2025-06-01"));
  const [month, setMonth] = useState<Date | undefined>(date);
  // Add separate state for registration date
  const [openReg, setOpenReg] = useState(false);
  const [dateReg, setDateReg] = useState<Date | undefined>(new Date());
  const [monthReg, setMonthReg] = useState<Date | undefined>(dateReg);

  useEffect(() => {
    fetchPrograms();
  }, []);
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <HeaderAdmin />
      <div className="flex flex-col w-full mt-20">
        <div style={{ background: "#919090" }} className="w-auto mt-14">
          <span className="text-white pl-15">PERSONAL DATA</span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-row mt-10 items-center">
              <span className="pl-15 w-100">Student ID:</span>
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Student ID"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Program:</span>
              <FormField
                control={form.control}
                name="program_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-110">
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black w-110">
                          {programs.map((program) => (
                            <SelectItem
                              key={program.program_id}
                              value={program.program_id.toString()}
                            >
                              {program.program_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Year Level */}
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Year Level*:</span>
              <FormField
                control={form.control}
                name="year_level"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-110">
                          <SelectValue placeholder="Select Year Level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Semester */}
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Semester*:</span>
              <FormField
                control={form.control}
                name="sem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-110">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="First Semester">
                            First Semester
                          </SelectItem>
                          <SelectItem value="Second Semester">
                            Second Semester
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* School Year */}
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">School Year*:</span>
              <div className="flex gap-2 w-110">
                <Input
                  placeholder="From (e.g. 2025)"
                  className="flex-1"
                  onChange={(e) => {
                    const from = e.target.value;
                    const to =
                      form.getValues("school_year").split("-")[1] || "";
                    form.setValue(
                      "school_year",
                      from && to ? `${from}-${to}` : from
                    );
                  }}
                />
                <span className="flex-none self-center">-</span>
                <Input
                  placeholder="To (e.g. 2026)"
                  className="flex-1"
                  onChange={(e) => {
                    const to = e.target.value;
                    const from =
                      form.getValues("school_year").split("-")[0] || "";
                    form.setValue(
                      "school_year",
                      from && to ? `${from}-${to}` : to
                    );
                  }}
                />
              </div>
              <FormMessage />
            </div>

            {/* Registration Date */}
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Registration Date:</span>
              <FormField
                control={form.control}
                name="registration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-fit">
                        <Input
                          required
                          disabled
                          value={field.value ?? ""}
                          placeholder="Registration Date"
                          className="bg-background pr-10 w-110"
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setOpenReg(true);
                            }
                          }}
                        />
                        <Popover open={openReg} onOpenChange={setOpenReg}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 p-0"
                            >
                              <CalendarIcon className="size-4 text-muted-foreground" />
                              <span className="sr-only">Select date</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0 bg-white text-black"
                            align="end"
                            alignOffset={-8}
                            sideOffset={10}
                          >
                            <Calendar
                              mode="single"
                              selected={dateReg}
                              captionLayout="dropdown"
                              month={monthReg}
                              onMonthChange={setMonthReg}
                              onSelect={(date) => {
                                if (date) {
                                  const formatted =
                                    date.toLocaleDateString("en-CA");
                                  setDateReg(date);
                                  field.onChange(formatted);
                                  setOpenReg(false);
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Surname*:</span>
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Surname"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">First Name*:</span>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Middle Name*:</span>
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Middle Name"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Email*:</span>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Gender*:</span>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        required
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="M"
                            id=" M"
                            className="data-[state=checked]:bg-[#1BB2EF]"
                          />
                          <Label htmlFor="Male">M</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="F"
                            id="F"
                            className="data-[state=checked]:bg-[#1BB2EF]"
                          />
                          <Label htmlFor="Female">F</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Nationality*:</span>
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        placeholder="Nationality"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Civil Status*:</span>
              <FormField
                control={form.control}
                name="civil_status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        required
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="placeholder:text-slate-400 text-gray-500 border-black w-110">
                          <SelectValue placeholder="Civil Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Religion*:</span>
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        placeholder="Religion"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Date of Birth*:</span>
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-fit">
                        <Input
                          required
                          disabled
                          id="date"
                          value={field.value ?? ""}
                          placeholder="Birthday"
                          className="bg-background pr-10 w-110"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(e.target.value);
                            if (isValidDate(date)) {
                              setDate(date);
                              setMonth(date);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setOpen(true);
                            }
                          }}
                        />

                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              id="date-picker"
                              variant="ghost"
                              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 p-0"
                            >
                              <CalendarIcon className="size-4 text-muted-foreground" />
                              <span className="sr-only">Select date</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0 bg-white text-black"
                            align="end"
                            alignOffset={-8}
                            sideOffset={10}
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              month={month}
                              onMonthChange={setMonth}
                              onSelect={(date) => {
                                if (date) {
                                  const formatted =
                                    date.toLocaleDateString("en-CA");

                                  setDate(date);
                                  field.onChange(formatted);
                                  setOpen(false);
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Place of Birth:</span>
              <FormField
                control={form.control}
                name="birthplace"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Place of Birth"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Street:</span>
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="House No. , Street"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Barangay:</span>
              <FormField
                control={form.control}
                name="barangay"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Barangay"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Region:</span>
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Region"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Municipality:</span>
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Municipality"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Mobile Number*:</span>
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        type="text"
                        placeholder="Mobile Number"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              style={{ background: "#919090" }}
              className="w-auto mt-14 mb-8"
            >
              <span className="text-white pl-15">IN CASE OF EMERGENCY</span>
            </div>
            <span className="pl-15" style={{ color: "#B71C1C" }}>
              GUARDIAN INFORMATION
            </span>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Name:</span>
              <FormField
                control={form.control}
                name="guardian_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Surname, First Name"
                        {...field}
                        className="w-110"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);

                          const [surname = "", firstName = ""] = value
                            .split(",")
                            .map((str) => str.trim());
                          form.setValue("guardian_surname", surname);
                          form.setValue("guardian_first_name", firstName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Relation with the Student:</span>
              <FormField
                control={form.control}
                name="relation_with_the_student"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Ex. Mother"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Mobile Number:</span>
              <FormField
                control={form.control}
                name="guardian_mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Mobile Number"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row mt-5 items-center">
              <span className="pl-15 w-100">Email:</span>
              <FormField
                control={form.control}
                name="guardian_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        {...field}
                        className="w-110"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-5 mr-8 mb-5">
              <Button
                type="submit"
                className="bg-[#1BB2EF] text-white ml-4 w-fit"
              >
                Add Student
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
export default NewStudentSingle;
