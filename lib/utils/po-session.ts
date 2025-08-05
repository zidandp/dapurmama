import { POSession } from "@/lib/types";

export function isPOSessionActive(session: POSession): boolean {
  const now = new Date();
  const startDate = new Date(session.startDate);
  const endDate = new Date(session.endDate);

  return session.status === "ACTIVE" && now >= startDate && now <= endDate;
}

export function getPOSessionStatusText(status: POSession["status"]): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "ACTIVE":
      return "Aktif";
    case "CLOSED":
      return "Ditutup";
    default:
      return "Unknown";
  }
}

export function getPOSessionStatusColor(status: POSession["status"]): string {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800";
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "CLOSED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function formatPOSessionDateRange(
  startDate: string,
  endDate: string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  return `${start.toLocaleDateString(
    "id-ID",
    options
  )} - ${end.toLocaleDateString("id-ID", options)}`;
}
