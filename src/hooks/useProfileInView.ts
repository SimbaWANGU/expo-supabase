import { type SingerProfile } from '../interface/interface'
import { useStore } from '../zustand/store'

const useProfileInView = (): [SingerProfile, (singer: SingerProfile) => void] => {
	const [profileInView, setProfileInView] = useStore((state) => [state.profileInView, state.setProfileInView])

	return [profileInView, setProfileInView]
}

export default useProfileInView