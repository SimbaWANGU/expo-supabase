import React, { useContext } from 'react'
import tw from 'twrnc'
import { AntDesign } from '@expo/vector-icons'
import { Redirect, Stack, useRouter } from 'expo-router'
import { Pressable, useColorScheme, Image } from 'react-native'
import { light, dark } from '../../src/constants/Colors'
import { SessionContext } from '../../src/context/SessionContext'
import { useQueryClient } from '@tanstack/react-query'
import { UserProfile } from '../../src/interface/interface'
import { View } from '../../src/components/Themed'

export default function SettingsLayout() {
	const session = useContext(SessionContext)
	const router = useRouter()
	const queryClient = useQueryClient()
	const data = queryClient.getQueryData([`user-${session?.user.id}`]) as UserProfile

	if (!session) {
		return <Redirect href="/auth/onboard" />
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name={'index'}
				options={{
					headerShown: true,
					header: () => {
						return (
							<View style={tw`bg-transparent`}>
								<Pressable
									style={tw`p-4 absolute`}
									onPress={() => {
										router.back()
									}}
								>
									<AntDesign
										name={'arrowleft'}
										size={30}
										color={useColorScheme() === 'dark' ? dark.appBaseColorTwo : light.appBaseColor}
									/>
								</Pressable>
								<Image
									source={{ uri : data?.avatar_url ?? 'https://picsum.photos/id/237/700/800' }}
									style={tw`h-1/12 aspect-square absolute right-4 top-4 p-4 rounded-full `}
								/>
							</View>
						)
					}
				}}
				getId={() => String(Date.now()) }	
			/>
		</Stack>
	)
}
