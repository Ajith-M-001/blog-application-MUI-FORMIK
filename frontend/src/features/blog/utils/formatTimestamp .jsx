const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export { formatTimestamp };
