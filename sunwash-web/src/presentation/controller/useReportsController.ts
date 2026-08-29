import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AppointmentStatus } from "../../domain/Appointment";
import { useDependencies } from "../context/useDependencies";

const NOW_DATE = new Date()
  .toISOString()
  .split("T")[0]
  .split("-")
  .reverse()
  .join("/");
const NOW_HOUR = new Date().toISOString().split("T")[1].split(".")[0];

const REPORTS_PAGE_SIZE = 100;
const REPORT_EXPORT_FILENAME = `Relatório - ${NOW_DATE} - ${NOW_HOUR}.pdf`;
const REPORT_EXPORT_ERROR_MESSAGE = "Não foi possível exportar o relatório.";

export const useReportsController = () => {
  const { listAllAppointmentsUseCase, appointmentGateway } = useDependencies();
  const [clientFilter, setClientFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppointmentStatus>(
    "ALL",
  );
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeFilters = {
    client: clientFilter.trim() || undefined,
    startDate: startDateFilter || undefined,
    endDate: endDateFilter || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  };

  const filters = {
    ...activeFilters,
    page: 1,
    limit: REPORTS_PAGE_SIZE,
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["reports-appointments", filters],
    queryFn: async () => listAllAppointmentsUseCase.execute(filters),
  });

  const appointments = data?.data ?? [];
  const totalItems = data?.meta.totalItems ?? 0;
  const totalRevenue = appointments.reduce(
    (sum, appointment) => sum + appointment.price,
    0,
  );
  const completedCount = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;
  const inProgressCount = appointments.filter(
    (appointment) => appointment.status === "IN_PROGRESS",
  ).length;

  const exportReport = async (): Promise<void> => {
    if (isExporting) return;

    setErrorMessage(null);
    setIsExporting(true);

    try {
      const blob = await appointmentGateway.exportReport(activeFilters);
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = REPORT_EXPORT_FILENAME;
      link.click();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : REPORT_EXPORT_ERROR_MESSAGE,
      );
    } finally {
      setIsExporting(false);
    }
  };

  return {
    appointments,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    clientFilter,
    setClientFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    statusFilter,
    setStatusFilter,
    clearFilters: () => {
      setClientFilter("");
      setStartDateFilter("");
      setEndDateFilter("");
      setStatusFilter("ALL");
    },
    totalItems,
    totalRevenue,
    completedCount,
    inProgressCount,
    isExporting,
    exportReport,
    errorMessage,
    clearError: () => setErrorMessage(null),
    refetch,
  };
};
