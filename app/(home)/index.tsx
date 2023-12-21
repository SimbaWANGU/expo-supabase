import React, { useState } from 'react'
import { View } from '../../src/components/Themed'
import tw from 'twrnc'
import { light, dark } from '../../src/constants/Colors'
import EditScreenInfo from '../../src/components/EditScreenInfo'
import { Alert, Pressable } from 'react-native'
import { MonoText } from '../../src/components/StyledText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../src/utils/Supabase'
import { useRouter } from 'expo-router'

export default function Home() {
	const [, setLoading] = useState(false)
	const queryClient = useQueryClient()
	const router = useRouter()
	const signOut = useMutation({
		mutationFn: async () => {
			await supabase.auth.signOut()
		},
		onSuccess: () => {
			setLoading(false)
			queryClient.invalidateQueries({
				queryKey: ['session'],
			})
			Alert.alert(
				'Signed out!',
				'Your session has been invalidated.',
				[
					{
						text: 'Ok',
						onPress: () => router.push('/'),
						style: 'cancel',
					},
				],
			)
		},
		onError: (error) => {
			setLoading(false)
			Alert.alert(error.message)
		},
	})

	return (
		<View
			style={tw`h-full w-full justify-center items-center`}
			lightColor={light.background}
			darkColor={dark.background}  
		>
			<EditScreenInfo path="/app/tabs/index.tsx" />
			<Pressable
				style={tw`bg-blue-500 p-4 rounded-md`}
				onPress={() => {
					setLoading(true)
					signOut.mutate()
				}}
			>
				<MonoText>Logout</MonoText>
			</Pressable>
		</View>
	)
}
