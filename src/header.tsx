import { IoArrowBackSharp } from "react-icons/io5";

function Header() {
  const showBackButton = window.location.pathname !== "/nstsps/student-home";

  const handleBackClick = () => {
    window.location.href = "http://localhost:5173/nstsps/student-home";
  };

  return (
    <div className="fixed top-0 left-[317px] w-[calc(100%-317px)] flex justify-center z-49 bg-white">
      <div className="relative mt-8">
        <span className="my-class text-6xl" style={{ color: "#00ACED" }}>
          STUDENT PORTAL
        </span>

        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="absolute right-[-200px] top-1/2 -translate-y-1/2 flex items-center text-[#00ACED] hover:underline text-base"
          >
            <IoArrowBackSharp size={18} className="mr-1" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
