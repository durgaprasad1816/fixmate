const STATUS_STYLES = {
  PENDING: "badge badge-pending",
  ACCEPTED: "badge badge-accepted",
  REJECTED: "badge badge-rejected",
  IN_PROGRESS: "badge badge-progress",
  COMPLETED: "badge badge-completed",
  CANCELLED: "badge badge-cancelled",
};

export default function StatusBadge({ status }) {
  return <span className={STATUS_STYLES[status] || "badge"}>{status.replace("_", " ")}</span>;
}
