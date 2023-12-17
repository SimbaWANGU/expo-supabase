import React from 'react'
import { View } from '../../src/components/Themed'
import tw from 'twrnc'
import { light, dark } from '../../src/constants/Colors'
import EditScreenInfo from '../../src/components/EditScreenInfo'

const leaderboard = () => {
	return (
		<View
			style={[tw`h-full w-full justify-center items-center`]}
			lightColor={light.background}
			darkColor={dark.background}  
		>
			<EditScreenInfo path="/app/%28tabs%29/leaderboard.tsx" />
		</View>
	)
}

export default leaderboard
