class OrgAlreadyExistsError extends Error {
  constructor() {
    super(`Resource already exists! `)
  }
}
export { OrgAlreadyExistsError }
