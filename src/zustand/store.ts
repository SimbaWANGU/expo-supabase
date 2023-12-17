import { create } from 'zustand'
import { type Store } from '../interface/interface'

const useStore = create<Store>((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	reset: () => set({ count: 0 })
}))

export { useStore }