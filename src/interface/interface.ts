interface Store {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export {
	Store,
}