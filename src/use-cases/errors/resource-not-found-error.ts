class ResourceNotFoundError extends Error {
  constructor(message?: string) {
    super(`Resource ${message && message} not found! `)
  }
}
export { ResourceNotFoundError }
