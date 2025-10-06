"use client";

import { useEffect, useState } from "react";
import { useRequest } from "@/context/request-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ArchiveRequestTable() {
  const { getProcessedOrDeclinedRequests, loading } = useRequest();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchArchiveRequests = async () => {
      const data = await getProcessedOrDeclinedRequests();
      setRequests(data);
    };
    fetchArchiveRequests();
  }, [getProcessedOrDeclinedRequests]);

  return (
    <Table className="border-none">
      <TableHeader className="bg-[#919090] text-white">
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center py-4">
              Loading archived requests...
            </TableCell>
          </TableRow>
        ) : requests.length > 0 ? (
          requests.map((req, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium max-w-[40%]">
                {req.request}
              </TableCell>
              <TableCell className="max-w-[40%]">{req.status}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center py-4">
              No archived requests found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ArchiveRequestTable;
