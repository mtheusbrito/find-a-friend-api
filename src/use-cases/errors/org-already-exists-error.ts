class OrgAlreadyExistsError extends Error {
  constructor(message?: string) {
    message && console.log(message)
    super(`Resource already exists! `)
  }
}
export { OrgAlreadyExistsError }
