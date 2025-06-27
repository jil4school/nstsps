import NST from "./assets/NST.png";
import { Input } from "./components/ui/input";

function App() {
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
        className=" w-[200px] sm:w-[100px] md:w-[150px] lg:w-[200px] xl:w-[306px] h-[374px] sm:h-[124px] md:h-[185px] lg:h-[309px] xl:h-[374px] flex-col items-center p-15 bg-amber-200"
     >
        <span className="my-class text-white">User Login</span>
        <Input className="bg-white mb-4 h-[45px]" />
        <Input className="bg-white h-[45px]" />
      </div>
    </div>
  );
}

export default App;
