import React, { useContext } from 'react'
import tw from 'twrnc'
import { View } from '../../src/components/Themed'
import { MonoText } from '../../src/components/StyledText'
import { Input } from 'react-native-elements'
import { Pressable, useColorScheme, ScrollView } from 'react-native'
import { dark, light, colors } from '../../src/constants/Colors'
import Color from '../../src/components/Color'
import { useLocalSearchParams } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Entry } from '../../src/interface/interface'
import { SessionContext } from '../../src/context/SessionContext'
import { supabase } from '../../src/utils/Supabase'

const update = () => {
	const theme = useColorScheme()
	const session = useContext(SessionContext)
	const queryClient = useQueryClient()
	const { update } = useLocalSearchParams()
	const entries = queryClient.getQueryData([`entries-${session?.user.id}`]) as Entry[]
	const entry = entries.find((entry) => entry.id === Number(update)) as Entry
	const [title, setTitle] = React.useState<string>(entry.title)
	const [description, setDescription] = React.useState<string>(entry.description)
	const [colorSelected, setColorSelected] = React.useState<string>(entry.color)
	

	const updateMutation = useMutation({
		mutationFn: async () => {
			const { data, error } = await supabase.from('entries').update({
				title,
				description,
				color: colorSelected
			}).eq('id', entry.id)
			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [`entries-${session?.user.id}`]
			})
			setTitle('')
			setDescription('')
			setColorSelected('')
		}
	})
  
	return (
		<View style={tw`h-full w-full items-center justify-center`}>
			<ScrollView
				style={tw`w-full h-full mt-14`}
				contentContainerStyle={tw`justify-around p-4`}	
			>
				<MonoText style={tw`text-3xl`}>Update Post...</MonoText>
				<ScrollView style={tw``}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{colors.map((color, index) => (
						<Pressable
							key={index}
							style={[tw`rounded-full w-10 h-10 m-2 border-2`, {
								borderColor: colorSelected === color ? theme === 'light' ? light.appBaseColor : dark.appBaseColorFour : 'transparent',
								backgroundColor: color
							}]}
							onPress={() => setColorSelected(color)}
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
						rightIcon={title !== '' ? { type: 'font-awesome', name: 'remove', size: 20, color: 'black', onPress: () => setTitle('') } : undefined}
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
						rightIcon={description !== '' ? { type: 'font-awesome', name: 'remove', size: 20, color: 'black', onPress: () => setTitle('') } : undefined}
						rightIconContainerStyle={tw`mt-8`}
						multiline
						value={description}
						onChangeText={setDescription}            
					/>
				</View>
				<Pressable
					style={[tw`rounded-lg p-4 mt-4 w-1/2 self-center`, {
						backgroundColor: theme === 'light' ? light.appBaseColorTwo : dark.appBaseColorTwo,
					}]}
					onPress={() => updateMutation.mutate()}
				>
					<MonoText
						style={tw`text-2xl text-center`}
						lightColor={light.appBaseColorThree}
						darkColor={dark.appBaseColorFour}
					>Update</MonoText>
				</Pressable>
			</ScrollView>
		</View>
	)
}

export default update