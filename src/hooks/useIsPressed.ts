import { type Dispatch, type SetStateAction, useState } from 'react'

const useIsPressed = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
	const [isPressed, setIsPressed] = useState(false)

	return [isPressed, setIsPressed]
}

export default useIsPressed