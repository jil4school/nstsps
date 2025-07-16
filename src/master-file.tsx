import { useForm } from "react-hook-form";
import SideBar from "./side-bar";
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
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Header from "./header";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  student_id: z.number(),
  program: z.string(),
  surname: z.string(),
  first_name: z.string(),
  middle_name: z.string(),
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

async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    console.log("Form submitted with values:", values);
  } catch (error: any) {
    console.error("Unexpected error:", error);
  }
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function MasterFile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: 0,
      program: "",
      surname: "",
      first_name: "",
      middle_name: "",
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
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);

  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <SideBar />
      <Header />
      <div className="flex flex-col w-full mt-23 ml-[317px]">
        <div style={{ background: "#919090" }} className="w-auto mt-14">
          <span className="text-white pl-15">PERSONAL DATA</span>
        </div>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
          >
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
                        disabled
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Program"
                        {...field}
                        disabled
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
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
                        disabled
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        disabled
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        disabled
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        defaultValue="Male"
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Male"
                            id="Male"
                            className="data-[state=checked]:bg-[#1BB2EF]"
                          />

                          <Label htmlFor="Male">M</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Female"
                            id="Female"
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                      <Select required>
                        <SelectTrigger className=" placeholder:text-slate-400 text-gray-500 border-black w-110">
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        <Input required
                          id="date"
                          value={field.value ?? ""}
                          placeholder="Birthday"
                          disabled
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
                                setDate(date);
                                field.onChange(formatDate(date));
                                setOpen(false);
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                      <Input required
                        type="number"
                        placeholder="Mobile Number"
                        {...field}
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div style={{ background: "#919090" }} className="w-auto mt-14">
              <span className="text-white pl-15">IN CASE OF EMERGENCY</span>
            </div>
            <span className="pl-15 mt-10" style={{ color: "#B71C1C" }}>
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
                          const value = e.target.value.toUpperCase();
                          field.onChange(value); // sets guardian_name

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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        type="number"
                        placeholder="Mobile Number"
                        {...field}
                        className="w-110"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-5 mr-30">
              <Button
                type="submit"
                className="bg-[#1BB2EF] text-white ml-15 w-20 "
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
export default MasterFile;
