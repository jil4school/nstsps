import axios from "axios";

export const getStudentInfo = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost/NSTSPS_API/student-info.php?user_id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student info:", error);
    throw error;
  }
};
