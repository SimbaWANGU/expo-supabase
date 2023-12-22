import React from 'react'
import tw from 'twrnc'
import { View } from '../components/Themed'

interface ColorProps {
  color: string
}

const Color: React.FC<ColorProps> = ({ color }) => {
	return (
		<View
			style={[tw`w-1/12 aspect-square self-center rounded-full right-0`, {
				backgroundColor: color
			}]}
		/>
	)
}

export default Color