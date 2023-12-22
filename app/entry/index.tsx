import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import { View } from '../../src/components/Themed'
import { MonoText } from '../../src/components/StyledText'
import { Input } from 'react-native-elements'
import { Pressable, useColorScheme, ScrollView, Alert } from 'react-native'
import { dark, light, colors } from '../../src/constants/Colors'
import Color from '../../src/components/Color'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../src/utils/Supabase'
import { SessionContext } from '../../src/context/SessionContext'
import { useRouter } from 'expo-router'
import * as Sentry from 'sentry-expo'

const add = () => {
	const theme = useColorScheme()
	const session = useContext(SessionContext)
	const router = useRouter()
	const queryClient = useQueryClient()
	const [title, setTitle] = useState<string>('')
	const [entry, setEntry] = useState<string>('')
	const [colorSelected, setColorSelected] = useState<string>('')
	const [loading, setLoading] = useState(false)
	const createNewEntryMutation = useMutation({
		mutationFn: async () => {
			setLoading(true)
			const { data, error } = await supabase.from('entries').insert({
				title,
				description: entry,
				color: colorSelected,
				favorite: false,
				user_id: session?.user.id
			})
			if (error) {
				Sentry.Native.captureMessage('Error returned from creating entry')
				Sentry.Native.captureException(error)
			}
			return data
		},
		onSuccess: () => {
			setLoading(false)
			queryClient.invalidateQueries({
				queryKey: [`entries-${session?.user.id}`]
			})
			setTitle('')
			setEntry('')
			setColorSelected('')
			Alert.alert(
				'Entry created!',
				'Your entry has been created.',
				[
					{
						text: 'Ok',
						onPress: () => router.back(),
						style: 'cancel',
					},
				],
			)
		},
		onError: (error) => {
			Sentry.Native.captureMessage('Error caught from creating entry')
			Sentry.Native.captureException(error)
			setLoading(false)
			Alert.alert(error.message)
		}
	})
  
	return (
		<View style={tw`h-full w-full items-center justify-center`}>
			<ScrollView
				style={tw`w-full h-full mt-14`}
				contentContainerStyle={tw`justify-around p-4`}	
			>
				<MonoText style={tw`text-3xl`}>Add New Post...</MonoText>
				<ScrollView style={tw``}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{colors.map((color, index) => (
						<Pressable
							key={index}
							style={[tw`rounded-full w-10 h-10 m-2 border-2`, {
								transform: colorSelected === color ? [{ scale: 0.9 }] : [{ scale: 1 }],
								borderColor: colorSelected === color ? theme === 'light' ? light.appBaseColor : dark.appBaseColorFour : 'transparent',
								backgroundColor: color
							}]}
							onPress={() => {
								if (colorSelected === color) setColorSelected('')
								if (colorSelected !== color)setColorSelected(color)
							}}
						>
							<Color color={color} />
						</Pressable>
					))}
				</ScrollView>
				<View style={tw`rounded-xl mt-2`}>
					<Input
						placeholder="Title"
						style={[tw`text-2xl py-2`, {
							color: theme === 'light' ? light.appBaseColor : dark.text
						}]}
						rightIcon={title !== '' ? { type: 'font-awesome', name: 'remove', size: 20, color: theme === 'light' ? 'black' : 'white', onPress: () => setTitle('') } : undefined}
						rightIconContainerStyle={tw`mt-8`}
						value={title}
						onChangeText={setTitle}
					/>
				</View>
				<View style={tw`rounded-xl`}>
					<Input
						placeholder="What's on your mind?"
						style={[tw`text-lg pb-4`, {
							color: theme === 'light' ? light.appBaseColor : dark.text,
						}]}
						rightIcon={entry !== '' ? { type: 'font-awesome', name: 'remove', size: 20, color: theme === 'light' ? 'black' : 'white', onPress: () => setTitle('') } : undefined}
						rightIconContainerStyle={tw`mt-8`}
						multiline
						value={entry}
						onChangeText={setEntry}            
					/>
				</View>
				<Pressable
					style={[tw`rounded-lg p-4 mt-4 w-1/2 self-center`, {
						backgroundColor: theme === 'light' ? light.appBaseColorTwo : dark.appBaseColorTwo,
					}]}
					onPress={() => {
						if (title === '' || entry === '' || colorSelected === '') {
							Alert.alert(
								'Entry creation failed!',
								'Please fill in all the fields.',
								[
									{
										text: 'Ok',
										style: 'cancel',
									},
								],
							)
						} else {
							createNewEntryMutation.mutate()}
					}}
					disabled={loading}
				>
					<MonoText
						style={tw`text-2xl text-center`}
						lightColor={light.appBaseColorThree}
						darkColor={dark.appBaseColorFour}
					>Post</MonoText>
				</Pressable>
			</ScrollView>
		</View>
	)
}

export default add