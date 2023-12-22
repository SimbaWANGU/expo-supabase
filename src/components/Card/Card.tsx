import React from 'react'
import tw from 'twrnc'
import { View } from '../Themed'
import { MonoText, QuickSandText } from '../StyledText'
import { dark, light } from '../../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { Alert, Pressable, useColorScheme } from 'react-native'
import { formatDate } from '../../constants/Functions'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../utils/Supabase'

interface CardProps {
	id: number
  title: string
  description: string
  color: string
	favorite: boolean
	time_updated: string
}

const Card: React.FC<CardProps> = ({ id, title, description, color, favorite, time_updated}) => {
	const theme = useColorScheme()
	const [isFavorite, setIsFavorite] = React.useState<boolean>(favorite)

	const favoriteMutation = useMutation({
		mutationFn: async () => {
			setIsFavorite(!isFavorite)
			const { data, error } = await supabase.from('entries').update({
				favorite: !isFavorite
			}).eq('id', id).single()
			if (error) throw error
			return data
		},
		onSuccess: () => {},
		onError: (error) => {
			setIsFavorite(!isFavorite)
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

	return (
		<View
			style={[tw`h-auto w-11/12 self-center rounded-lg shadow-lg`, {
				borderWidth: theme === 'dark' ? 2 : 0,
				borderColor: theme === 'dark' ? color : 'tranparent'
			}]}
		>
			<View style={[tw`flex flex-row mx-auto border-b-8`, {
				borderColor: color
			}]}>
				<MonoText
					style={[tw`text-2xl p-2 w-10/12`]}
					numberOfLines={1}
					ellipsizeMode='tail'
					lightColor={light.tint}
					darkColor={dark.tint}
				>{title}</MonoText>
				<View
					style={[tw`w-6 aspect-square self-center rounded-full right-0`, {
						backgroundColor: color
					}]}
				/>
			</View>
			<QuickSandText
				style={tw`text-lg p-2 w-11/12 mx-auto`}
				numberOfLines={10}
				ellipsizeMode='tail'
			>{description}</QuickSandText>
			<View style={tw`h-20 w-11/12 self-center flex flex-row items-center justify-between`}>
				<Pressable
					style={[tw`z-10 p-2`]}
					onPress={() => favoriteMutation.mutate()}
				>
					{isFavorite ? (
						<AntDesign name="star" size={24} color={theme === 'light' ? light.appBaseColor : dark.appBaseColor} />
					) : (
						<AntDesign name="staro" size={24} color={theme === 'light' ? light.appBaseColor : dark.appBaseColor} />
					)}
				</Pressable>
				<MonoText
					style={tw`text-sm mt-4 p-2 w-11/12 mx-auto text-right`}
				>{formatDate(time_updated)}</MonoText>
			</View>
		</View>
	)
}

export default Card