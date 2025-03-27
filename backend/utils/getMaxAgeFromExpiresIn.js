// Helper function to convert expiresIn to milliseconds (for setting cookie maxAge)
function getMaxAgeFromExpiresIn(expiresIn) {
  const timeValue = parseInt(expiresIn.slice(0, -1), 10);
  const unit = expiresIn.slice(-1).toLowerCase();

  if (unit === "s") return timeValue * 1000; // seconds to milliseconds
  if (unit === "m") return timeValue * 60 * 1000; // minutes to milliseconds
  if (unit === "h") return timeValue * 60 * 60 * 1000; // hours to milliseconds
  if (unit === "d") return timeValue * 24 * 60 * 60 * 1000; // days to milliseconds
  return timeValue; // Fallback for custom formats
}

export { getMaxAgeFromExpiresIn };
