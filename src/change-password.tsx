import z from "zod";
import Header from "./header";
import SideBar from "./side-bar";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useLogin } from "./context/login-context";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;

const formSchema = z
  .object({
    user_id: z.number(),
    old_password: z.string(),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one letter and one number"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

function ChangePassword() {
  const { changePassword, user } = useLogin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: 0,
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (storedUserId) {
      const parsedUserId = parseInt(storedUserId, 10);
      form.setValue("user_id", Number(parsedUserId));

      form.setValue("user_id", parsedUserId);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    if (values.new_password !== values.confirm_password) {
      console.error("Passwords do not match");
      return;
    }

    const success = await changePassword(
      values.user_id,
      values.old_password,
      values.new_password,
      values.confirm_password
    );

    if (success) {
      console.log("Password changed successfully");
      // maybe reset the form here
    }
  }

  return (
    <>
      <div className="flex flex-row h-screen w-screen bg-white">
        <SideBar />
        <div className="flex flex-col w-full">
          <Header />
          <div className="bg-[#919090] ml-100 mt-45 w-230 h-15 justify-center items-center flex"></div>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }}
            >
              <div
                className="flex flex-col bg-[#FCFDFD] ml-100 w-230 h-90 rounded-[5px] shadow-custom items-center justify-center"
                style={{
                  boxShadow: "-4px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex flex-row items-center">
                  <span className="w-100">Old Password</span>
                  <FormField
                    control={form.control}
                    name="old_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your old password"
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
                <div className="flex flex-row mt-15 items-center">
                  <span className=" w-100">New Password</span>
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your new password"
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
                <div className="flex flex-row mt-15 items-center">
                  <span className=" w-100">Confirm Password</span>
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Retype your new password"
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
              </div>
              <div className="flex justify-center mt-5 mr-30 ml-90">
                <Button
                  type="submit"
                  className="bg-[#1BB2EF] text-white ml-15 w-fit p-2 "
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
export default ChangePassword;
