import React, { useState } from 'react'
import { Alert, Pressable, useColorScheme } from 'react-native'
import tw from 'twrnc'
import { View } from '../../src/components/Themed'
import { supabase } from '../../src/utils/Supabase'
import { Input } from 'react-native-elements'
import { dark, light } from '../../src/constants/Colors'
import { MonoText } from '../../src/components/StyledText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { makeRedirectUri } from 'expo-auth-session'
import * as Sentry from 'sentry-expo'

const redirectTo = makeRedirectUri()

export default function Auth() {
	const theme = useColorScheme()
	const router = useRouter()
	const queryClient = useQueryClient()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const signInWithEmailMutation = useMutation({
		mutationFn: async () => {
			await supabase.auth.signInWithPassword({ email, password })
		},
		onSuccess: () => {
			setLoading(false)
			queryClient.invalidateQueries({
				queryKey: ['session'],
			})
			Alert.alert(
				'Signed In!',
				'Your session.',
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
			Sentry.Native.captureMessage('Error returned from signing in')
			Sentry.Native.captureException(error)
			setLoading(false)
			Alert.alert(error.message)
		},
	})

	const signUpWithEmailMutation = useMutation({
		mutationFn: () => supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: redirectTo
			},
		}),
		onSuccess: () => {
			setLoading(false)
			Alert.alert('Check your email for email verification!')
		},
		onError: (error) => {
			Sentry.Native.captureMessage('Error returned from signing up')
			Sentry.Native.captureException(error)
			setLoading(false)
			Alert.alert(error.message)
		},
	})


	return (
		<View
			style={tw`h-full w-full items-center justify-center`}
			lightColor={light.background}
			darkColor={dark.background}
		>
			<View style={tw`h-1/12 w-10/12 py-2`}>
				<Input
					label="Email"
					leftIcon={{ type: 'font-awesome', name: 'envelope', color: light.appBaseColorThree, style: tw`pr-6` }}
					onChangeText={(text) => setEmail(text)}
					value={email}
					placeholder="email@address.com"
					autoCapitalize={'none'}
				/>
			</View>
			<View style={tw`h-1/12 w-10/12 py-2`}>
				<Input
					label="Password"
					leftIcon={{ type: 'font-awesome', name: 'lock', color: light.appBaseColorThree, style: tw`pr-10` }}
					onChangeText={(text) => setPassword(text)}
					value={password}
					secureTextEntry={true}
					placeholder="password"
					autoCapitalize={'none'}
				/>
			</View>
			<View style={tw`w-10/12 py-2`}>
				<Pressable
					disabled={loading}
					onPress={() => {
						setLoading(true)
						signInWithEmailMutation.mutate()
					}}
					style={[tw`rounded w-full p-2`, {
						backgroundColor: loading ? light.tint : theme === 'light' ? light.appBaseColorThree : dark.appBaseColorThree
					}]}
				>
					<MonoText
						lightColor={light.appBaseColorTwo}
						darkColor={dark.appBaseColorTwo}
						style={tw`text-center text-lg`}
					>Sign in</MonoText>
				</Pressable>
			</View>
			<View style={tw`w-10/12 py-2`}>
				<Pressable
					disabled={loading}
					onPress={() => {
						setLoading(true)
						signUpWithEmailMutation.mutate()
					}}
					style={[tw`rounded w-full p-2`, {
						backgroundColor: loading ? light.tint : theme === 'light' ? light.appBaseColorThree : dark.appBaseColorThree
					}]}
				>
					<MonoText
						lightColor={light.appBaseColorTwo}
						darkColor={dark.appBaseColorTwo}
						style={tw`text-center text-lg`}
					>Sign up</MonoText>
				</Pressable>
			</View>
		</View>
	)
}
