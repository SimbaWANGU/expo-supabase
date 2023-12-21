import React from 'react'
import tw from 'twrnc'
import { Pressable, useColorScheme } from 'react-native'
import { View } from '../../src/components/Themed'
import { useRouter } from 'expo-router'
import { MonoText, QuickSandText } from '../../src/components/StyledText'
import { light, dark } from '../../src/constants/Colors'

const onboard = () => {
	const router = useRouter()
	const theme = useColorScheme()

	return (
		<View
			style={tw`h-full w-full items-center justify-center`}
			lightColor={light.background}
			darkColor={dark.background}
		>
			<MonoText
				lightColor={light.text}
				darkColor={dark.text}
			>Welcome to Supabase App</MonoText>
			<Pressable
				onPress={() => router.replace('/auth/auth')}
				style={[tw`rounded p-2 border-2`, {
					borderColor: theme === 'light' ? light.appBaseColorThree : dark.appBaseColorThree
				}]}	
			>
				<QuickSandText
					lightColor={light.appBaseColorThree}
					darkColor={dark.appBaseColorThree}
				>Sign In or Create Account</QuickSandText>
			</Pressable>
		</View>
	)
}

export default onboard