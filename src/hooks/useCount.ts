import { useStore } from '../zustand/store'

const useCount = (): [number, () => void, () => void, () => void] => {
	const count = useStore((state) => state.count)
	const increment = useStore((state) => state.increment)
	const decrement = useStore((state) => state.decrement)
	const reset = useStore((state) => state.reset)

	return [count, increment, decrement, reset]
}

export default useCount