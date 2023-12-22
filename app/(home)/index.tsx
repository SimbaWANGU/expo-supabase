import React, { useContext } from 'react'
import { View } from '../../src/components/Themed'
import tw from 'twrnc'
import { light, dark } from '../../src/constants/Colors'
import { Alert, Pressable, ScrollView } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import Card from '../../src/components/Card/Card'
import { Ionicons } from '@expo/vector-icons'
import { SessionContext } from '../../src/context/SessionContext'
import { Entry } from '../../src/interface/interface'
import { supabase } from '../../src/utils/Supabase'
import * as Sentry from 'sentry-expo'

export default function Home() {
	const session = useContext(SessionContext)
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data } = useQuery({
		queryKey: [`entries-${session?.user.id}`],
		queryFn: async () => {
			try {
				const { data, error, status } = await supabase
					.from('entries')
					.select('*')
					.eq('user_id', session?.user.id)
					.order('time_updated', { ascending: false })
				if (error && status !== 406) { 
					Sentry.Native.captureMessage('Error returned from fetching profile, status code: ' + status)
					Sentry.Native.captureException(error)
					return []
				}
				if (data)	return data as Entry[]
			} catch (error) {
				Sentry.Native.captureMessage('Error catched from get user profile')
				Sentry.Native.captureException(error)
				return []
			}
		}
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: number) => {
			const { data, error } = await supabase.from('entries').delete().eq('id', id)
			if (error) {
				Sentry.Native.captureMessage('Error returned from deleting entry')
				Sentry.Native.captureException(error)
			}
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
			Sentry.Native.captureMessage('Error caught from deleting entry')
			Sentry.Native.captureException(error)
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
			style={tw`h-full w-full justify-center items-center`}
			lightColor={light.background}
			darkColor={dark.background}  
		>
			<ScrollView
				style={tw`w-full h-full p-2 mt-14`}
				contentContainerStyle={tw`justify-center`}	
			>
				{data?.map((entry, index) => (
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
							id={entry.id}
							title={entry.title}
							description={entry.description}
							color={entry.color}
							favorite={entry.favorite}
							time_updated={entry.time_updated}
						/>
					</Pressable>
				))}
			</ScrollView>
			<Pressable
				style={[tw`h-20 aspect-square rounded-full absolute bottom-5 right-5 items-center justify-center`, {
					backgroundColor: light.appBaseColorThree
				}]}
				onPress={() => router.push('entry/')}
			>
				<Ionicons name="add" style={tw`text-4xl`} color={light.appBaseColorTwo} />
			</Pressable>
		</View>
	)
}
