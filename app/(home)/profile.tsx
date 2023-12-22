import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, Pressable, ScrollView, useColorScheme } from 'react-native'
import tw from 'twrnc'
import { View } from '../../src/components/Themed'
import { light, dark, colors } from '../../src/constants/Colors'
import { SessionContext } from '../../src/context/SessionContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MonoText, QuickSandText } from '../../src/components/StyledText'
import { Entry, UserProfile } from '../../src/interface/interface'
import Color from '../../src/components/Color'
import Card from '../../src/components/Card/Card'
import { supabase } from '../../src/utils/Supabase'
import { useRouter } from 'expo-router'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'

const profile = () => {
	const theme = useColorScheme()
	const session = useContext(SessionContext)
	const router = useRouter()
	const queryClient = useQueryClient()
	const [colorSelected, setColorSelected] = useState<string>('')
	const [favoriteSelected, setFavoriteSelected] = useState<boolean>(false)
	const [username, setUsername] = useState<string | undefined | null>('')
	const [avatar, setAvatar] = useState<string | undefined | null>('https://picsum.photos/id/237/700/800')
	const [bio, setBio] = useState<string | undefined | null>('')
	const data = queryClient.getQueryData([`user-${session?.user.id}`]) as UserProfile
	const entries = queryClient.getQueryData([`entries-${session?.user.id}`]) as Entry[]
	const [entriesDisplayed, setEntriesDisplayed] = useState<Entry[]>(entries)

	useEffect(() => {
		if (colorSelected) {
			setEntriesDisplayed(entries.filter((entry) => entry.color === colorSelected))
		} else if (favoriteSelected) {
			setEntriesDisplayed(entries.filter((entry) => entry.favorite))
		} else {
			setEntriesDisplayed(entries)
		}
	}, [colorSelected, favoriteSelected])

	const deleteMutation = useMutation({
		mutationFn: async (id: number) => {
			const { data, error } = await supabase.from('entries').delete().eq('id', id)
			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [`entries-${session?.user.id}`]
			})
			Alert.alert(
				'Entry deleted!',
				'Your entry has been deleted.',
				[
					{
						text: 'Ok',
						style: 'cancel',
					},
				],
			)
		},
		onError: (error) => {
			Alert.alert(
				'Unable To Complete Action',
				error.message,
				[
					{
						text: 'Ok',
						style: 'cancel',
					},
				],
			)
		}
	})

	useEffect(() => {
		setUsername(data?.username)
		setAvatar(data?.avatar_url)
		setBio(data?.bio)
	}, [data])

	return (
		<View
			style={[tw`h-full w-full items-center p-2 flex flex-col`]}
			lightColor={light.background}
			darkColor={dark.background}
		>
			<View style={tw`h-3/12 w-full flex flex-col py-4`}>
				<View style={tw`flex flex-row w-full justify-between items-center`}>
					<Image
						source={{ uri: avatar ?? 'https://picsum.photos/id/237/700/800' }}
						style={tw`h-3/4 aspect-square rounded-full left-0 `}
					/>
					<View style={tw`flex flex-col text-right`}>
						<MonoText
							lightColor={light.appBaseColorTwo}
							darkColor={dark.text}
							style={tw`text-2xl text-right`}
						>{`@${username}` ?? '@username'}</MonoText>
						<QuickSandText
							lightColor={light.appBaseColorThree}
							darkColor={dark.appBaseColorThree}
							style={tw`text-lg text-right`}
						>{session?.user.email}</QuickSandText>
					</View>
					<View style={tw`flex flex-col text-right absolute right-6 bottom-0`}>
						<MonoText style={tw`text-xl text-right items-center`}><MaterialIcons name="text-snippet" color={useColorScheme() === 'light' ? light.appBaseColor : dark.appBaseColor} /> {entries.length}</MonoText>
						<Pressable
							onPress={() => setFavoriteSelected(!favoriteSelected)}
						>
							<MonoText style={tw`text-lg text-right`}><AntDesign name="star" color={useColorScheme() === 'light' ? light.appBaseColor : dark.appBaseColor} /> {entries.filter((entry) => entry.favorite).length}</MonoText>
						</Pressable>
					</View>
				</View>
				<View style={tw`py-2 flex flex-col`}>
					<QuickSandText
						lightColor={light.appBaseColorThree}
						darkColor={dark.appBaseColorThree}
						style={tw`text-sm`}
					>Bio</QuickSandText>
					<MonoText
						lightColor={light.appBaseColor}
						darkColor={dark.text}
						style={tw`text-lg`}
					>
						{bio ?? 'Update Me'}
					</MonoText>
				</View>
			</View>
			<ScrollView
				style={tw`h-1/12 top-3`}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{colors.map((color, index) => (
					<Pressable
						key={index}
						style={[tw`rounded-full w-10 h-10 mx-2 border-2`, {
							borderColor: colorSelected === color ? theme === 'light' ? light.appBaseColor : dark.appBaseColorFour : 'transparent',
							backgroundColor: color
						}]}
						onPress={() => {
							colorSelected === color ? setColorSelected('') : setColorSelected(color)}}
					>
						<Color color={color} />
					</Pressable>
				))}
			</ScrollView>
			<ScrollView
				style={tw`w-full`}
				showsVerticalScrollIndicator={false}
			>
				{entriesDisplayed.map((entry, index) => (
					<Pressable
						key={index}
						style={tw`my-4`}
						onPress={() => router.push(`entry/${entry.id}`)}
						onLongPress={() => Alert.alert(
							'Delete ',
							'Ae you sure you want to delete this entry?',
							[
								{
									text: 'Cancel',
									style: 'cancel',
								},
								{
									text: 'Delete',
									onPress: () => deleteMutation.mutate(entry.id),
									style: 'destructive',
								},
							],
						)}
					>
						<Card
							key={index}
							id={index}
							title={entry.title}
							description={entry.description}
							favorite={entry.favorite}
							color={entry.color}
							time_updated={entry.time_updated}
						/>
					</Pressable>
				))}
			</ScrollView>
		</View>
	)
}

export default profile