import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import Header from "./header";
import SideBar from "./side-bar";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import PendingRequestTable from "./pending-request-table";
import ArchiveRequestTable from "./archive-request-table";

const formSchema = z.object({
  user_id: z.number(),
  student_id: z.number(),
  request: z.string(),
  request_remarks: z.string(),
  request_purpose: z.string(),
  mode_of_payment: z.string(),
  receipt: z.instanceof(File).optional(),
});
async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    console.log("Form submitted with values:", values);
  } catch (error: any) {
    console.error("Unexpected error:", error);
  }
}
function RequestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: 0,
      student_id: 0,
      request: "",
      request_remarks: "",
      request_purpose: "",
      mode_of_payment: "",
      receipt: undefined,
    },
  });
  return (
    <>
      <div className="flex flex-row h-screen w-screen bg-white">
        <SideBar />
        <Header />

        <div className="flex flex-col">
          <div
            style={{ background: "#919090" }}
            className="ml-79 h-fit mt-37 w-auto"
          >
            <span className="text-white pl-15">
              OFFICE OF THE REGISTRAR REQUEST FORM
            </span>
          </div>
          <div className="flex flex-row w-screen gap-10">
            <div className="w-[75%] pl-[27%]">
              <div className="mt-5 w-full">
                <p style={{ fontSize: "13px" }}>
                  <b>Important Reminders, please read:</b>
                </p>

                <ol
                  style={{
                    listStyle: "decimal",
                    marginLeft: "1.5rem",
                    fontSize: "13px",
                  }}
                >
                  <li style={{ textAlign: "justify" }}>
                    Your request will only be processed after payment and
                    submission of proof of payment. If you are paying online,
                    please indicate your support ticket number on your payment
                    notes.
                  </li>
                  <li style={{ textAlign: "justify" }}>
                    Please allow a maximum of seven (7) working days to fulfill
                    your request - as long as you have the proper clearance.
                  </li>
                  <li style={{ textAlign: "justify" }}>
                    In some cases, if you have an outstanding balance with
                    accounting, then you need to settle your balance first
                    before your documents are released to you. You may email
                    accounting@nst.edu.ph if you need to get in touch with them.
                  </li>
                  <li style={{ textAlign: "justify" }}>
                    Some requests may be put on hold due to incomplete records
                    or lack of clearance. If this happens to you, we will inform
                    you via email.
                  </li>
                  <li style={{ textAlign: "justify" }}>
                    If your request can be sent in digital format, we shall send
                    it to your NST Email Account.
                  </li>
                </ol>
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    <div className="grid grid-cols-1 gap-y-6 mt-5">
                      <FormField
                        control={form.control}
                        name="request"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-500">
                              Request <span style={{ color: "red" }}>*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                onValueChange={field.onChange}
                                value={field.value}
                                required
                              >
                                <SelectTrigger className=" placeholder:text-slate-400 text-gray-500 border-black w-full rounded-sm">
                                  <SelectValue placeholder="Please identify the nature of your request" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-black">
                                  <SelectItem value="Certificate of Enrollment">
                                    Certificate of Enrollment{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 100.00)
                                    </span>
                                  </SelectItem>

                                  <SelectItem value="Certificate of Good Moral Character">
                                    Certificate of Good Moral Character{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 100.00)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="Certificate of Graduation">
                                    Certificate of Graduation{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 100.00)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="Certificate of Transfer/Honorable Dismissal">
                                    Certificate of Transfer/Honorable Dismissal{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 100.00)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="Certificate of Honors/Ranking">
                                    Certificate of Honors/Ranking{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 150.00)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="Certified true Copy of Document">
                                    Certified true Copy of Document{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 50.00 max of 3 copies per document)
                                    </span>
                                  </SelectItem>

                                  <SelectItem value="SF10/Form 137-A/Secondary Student Permanent Record">
                                    SF10/Form 137-A/Secondary Student Permanent
                                    Record{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 150.00)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="Transcript of Records">
                                    Transcript of Records{" "}
                                    <span style={{ color: "red" }}>
                                      (Php 150.00/page)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="Others">
                                    Others{" "}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="request_remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-500">
                              Request Description or Remarks
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="text-sm sm:text-base w-full"
                                placeholder="Optional detailed description of your request together with any relevant information."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="request_purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-500">
                              Request Purpose{" "}
                              <span style={{ color: "red" }}>*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                required
                                {...field}
                                className="text-sm sm:text-base w-full"
                                placeholder="Please state the purpose"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mode_of_payment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-500">
                              Mode of Payment{" "}
                              <span style={{ color: "red" }}>*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                onValueChange={field.onChange}
                                value={field.value}
                                required
                              >
                                <SelectTrigger className=" placeholder:text-slate-400 text-gray-500 border-black w-full rounded-sm">
                                  <SelectValue placeholder="Select your preferred mode of payment" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-black">
                                  <SelectItem value="GCash to GCash">
                                    GCash to GCash{" "}
                                  </SelectItem>
                                  <SelectItem value="Campus Cashier">
                                    Campus Cashier
                                  </SelectItem>
                                  <SelectItem value="GCash to Bank">
                                    GCash to Bank
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(form.watch("mode_of_payment") === "GCash to GCash" ||
                        form.watch("mode_of_payment") === "GCash to Bank") && (
                        <FormField
                          control={form.control}
                          name="receipt"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <div className="grid w-full max-w-sm items-center gap-1.5">
                                <FormLabel htmlFor="picture">Receipt</FormLabel>
                                <FormControl>
                                  <Input
                                    id="picture"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        onChange(file);
                                      }
                                    }}
                                    {...rest}
                                    className="w-full"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="flex justify-end mt-5">
                        <Button
                          type="submit"
                          className="bg-[#1BB2EF] text-white w-20"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            <div className="fixed top-50 right-5 w-[20%] h-120 bg-[#919090] rounded-md p-3">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="w-full bg-[#afadad] text-white">
                  <TabsTrigger value="Pending" className="w-[50%]">Pending</TabsTrigger>
                  <TabsTrigger value="Archive" className="w-[50%]">Archive</TabsTrigger>
                </TabsList>
                <TabsContent value="Pending">
                  <PendingRequestTable />
                </TabsContent>
                <TabsContent value="Archive">
                  <ArchiveRequestTable />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestForm;
