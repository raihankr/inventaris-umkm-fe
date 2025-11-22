export function formatBreadcrumb(text) {
  if (text === "editprofile") return "Edit Profile";

  return text
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
