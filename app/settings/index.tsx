import React, { useContext, useEffect, useState } from 'react'
import { Alert, Pressable, useColorScheme } from 'react-native'
import tw from 'twrnc'
import { View } from '../../src/components/Themed'
import { light, dark } from '../../src/constants/Colors'
import { SessionContext } from '../../src/context/SessionContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../src/utils/Supabase'
import { Input } from 'react-native-elements'
import { UserProfile } from '../../src/interface/interface'
import { MonoText } from '../../src/components/StyledText'
import { useRouter } from 'expo-router'
import * as Sentry from 'sentry-expo'

const settings = () => {
	const session = useContext(SessionContext)
	const router = useRouter()
	const theme = useColorScheme()
	const queryClient = useQueryClient()
	const [loading, setLoading] = useState(false)
	const data = queryClient.getQueryData([`user-${session?.user.id}`]) as UserProfile
	const [username, setUsername] = useState<string | undefined | null>('')
	const [, setAvatar] = useState<string | undefined | null>('')
	const [bio, setBio] = useState<string | undefined | null>('')
	const [, setExpoPushToken] = useState<string | undefined | null>('')

	const updateProfileMutation = useMutation({
		mutationFn: async () => {
			setLoading(true)
			const { data, error } = await supabase.from('profiles').update({
				username,
				avatar_url: null,
				bio
			}).eq('id', session?.user.id).single()
			if (error) {
				Sentry.Native.captureMessage('Error returned from updating profile')
				Sentry.Native.captureException(error)
			}
			return data
		},
		onSuccess: () => {
			setLoading(false)
			Alert.alert(
				'Profile update!',
				'Your profile has been updated.',
				[
					{
						text: 'Ok',
						onPress: () => router.back(),
						style: 'cancel',
					},
				],
			)
			queryClient.invalidateQueries({
				queryKey: [`user-${session?.user.id}`],
			})
		},
		onError: (error) => {
			Sentry.Native.captureMessage('Error caught from updating profile')
			Sentry.Native.captureException(error)
			setLoading(false)
			Alert.alert(
				'Profile update failed!',
				error.message,
				[
					{
						text: 'Ok',
						onPress: () => router.back(),
						style: 'cancel',
					},
				],  
			)
		},
	})

	useEffect(() => {
		if (data) {
			setUsername(data.username)
			setAvatar(data.avatar_url ?? 'https://picsum.photos/id/237/700/800')
			setBio(data.bio)
			setExpoPushToken(data.expopushtoken)
		}
	}, [data])

	return (
		<View
			style={[tw`h-full w-full justify-center items-center`]}
			lightColor={light.background}
			darkColor={dark.background}
		>
			<View style={tw`h-1/12 w-11/12 p-2`}>
				<Input
					label="Email"
					style={{
						color: theme === 'light' ? light.text : dark.text,
					}}
					value={session?.user?.email}
					disabled
				/>
			</View>
			<View style={tw`h-1/12 w-11/12 p-2`}>
				<Input
					label="Username"
					value={username || ''}
					style={{
						color: theme === 'light' ? light.text : dark.text,
					}}
					onChangeText={(text) => setUsername(text)}
					disabled={loading}
				/>
			</View>
			<View style={tw`h-1/12 w-11/12 p-2`}>
				<Input
					label="Bio"
					value={bio || ''}
					style={{
						color: theme === 'light' ? light.text : dark.text,
					}}
					multiline
					maxLength={100}
					onChangeText={(text) => setBio(text)}
					disabled={loading}
				/>
			</View>
			<View style={tw`h-1/12 w-6/12 p-2`}>
				<Pressable
					style={[tw`p-2 rounded-md`, {
						backgroundColor: theme === 'light' ? light.appBaseColorTwo : dark.appBaseColorTwo,
					}]}
					onPress={() => updateProfileMutation.mutate()}
					disabled={loading}
				>
					<MonoText
						style={tw`text-center text-lg p-1`}
						lightColor={light.appBaseColorThree}  
						darkColor={dark.appBaseColorFour}
					>Update</MonoText>
				</Pressable>
			</View>
		</View>
	)
}

export default settings