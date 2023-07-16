class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized!')
  }
}
export { UnauthorizedError }
