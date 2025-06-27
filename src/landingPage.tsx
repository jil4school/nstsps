import NST from "./assets/NST.png";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { Icon } from "@iconify/react";
function LandingPage() {
  return (
    <div className="flex flex-row justify-center items-center h-screen w-screen bg-gray-100">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width={20}
            height={20}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5m-4 9.5A3.75 3.75 0 0 0 4.25 17v1.188c0 .754.546 1.396 1.29 1.517c4.278.699 8.642.699 12.92 0a1.54 1.54 0 0 0 1.29-1.517V17A3.75 3.75 0 0 0 16 13.25h-.34q-.28.001-.544.086l-.866.283a7.25 7.25 0 0 1-4.5 0l-.866-.283a1.8 1.8 0 0 0-.543-.086z" />
          </svg>
          <Input
            className="pl-10 bg-white h-[45px] border-0 focus:border-0 focus:ring-0 focus:outline-none"
            placeholder="nst email..."
          />
        </div>
        <div className="relative w-full mb-7">
          <Icon
            icon="mdi:password"
            width="20"
            height="20"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            className="pl-10 bg-white h-[45px] border-0 focus:border-0 focus:ring-0 focus:outline-none"
            placeholder="password..."
          />
        </div>
        <div className="flex justify-center mb-3">
          <Button
            className="text-white hover:opacity-70 cursor-pointer"
            style={{ background: "#0F88B6" }}
          >
            Login
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            variant="link"
            style={{ color: "#919090" }}
            className="cursor-pointer"
          >
            Forgot Password?
          </Button>
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
