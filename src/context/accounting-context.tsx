import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface Accounting {
  id: string;
  user_id: string;
  balance: number;
  school_year: string;
  sem: string;
}
interface AccountingContextType {
  accountingRecord: Accounting | null; // single record or null
  fetchAccounting: (user_id: string | number) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider = ({ children }: { children: ReactNode }) => {
  const [accountingRecord, setAccountingRecord] = useState<Accounting | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchAccounting = async (user_id: string | number): Promise<void> => {
  try {
    const response = await axios.get(
      `http://localhost/NSTSPS_API/controller/AccountingController.php`,
      { params: { user_id } }
    );

    // If backend returns an array, take the first one
    if (Array.isArray(response.data) && response.data.length > 0) {
      setAccountingRecord(response.data[0]);
    } else {
      setAccountingRecord(null);
      setError("No accounting record found.");
      toast.error("No accounting record found.");
    }
  } catch (err: any) {
    const message = err.response?.data?.error ?? err.message ?? "Accounting request failed";
    toast.error(message);
    setError(message);
    setAccountingRecord(null);
  }
};

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      fetchAccounting(storedUserId);
    }
  }, []);

  const value: AccountingContextType = {
    accountingRecord,
    fetchAccounting,
    error,
    setError,
  };

  return (
    <AccountingContext.Provider value={value}>
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider");
  }
  return context;
};
