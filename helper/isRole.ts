function isRole(value: unknown): value is "USER" | "ADMIN" {
  return value === "USER" || value === "ADMIN";
}
export { isRole };