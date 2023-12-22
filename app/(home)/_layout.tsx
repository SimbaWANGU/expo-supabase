import React, { useContext } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import tw from 'twrnc'
import { Redirect, Tabs, router } from 'expo-router'
import { Pressable, useColorScheme, Image } from 'react-native'
import { light, dark } from '../../src/constants/Colors'
import { SessionContext } from '../../src/context/SessionContext'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../src/utils/Supabase'
import { UserProfile } from '../../src/interface/interface'
import { View } from '../../src/components/Themed'
import { MonoText } from '../../src/components/StyledText'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
	return <FontAwesome size={24} {...props} />
}

export default function TabLayout() {
	const theme = useColorScheme()
	const session = useContext(SessionContext)
	
	if (!session) {
		return <Redirect href="/auth/onboard" />
	}
	
	const { data } = useQuery({
		queryKey: [`user-${session?.user.id}`],
		queryFn: async () => {
			try {
				const { data, error, status } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single()
				if (error && status !== 406) return {} as UserProfile
				if (data)	return data as UserProfile
			} catch (error) {
				console.log('error', error)
				return {} as UserProfile
			}
		}
	})

	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: theme === 'dark' ? dark.background : light.background,
					// borderTopColor: theme === 'dark' ? dark.appBaseColor : light.appBaseColor,
					borderTopWidth: 0,
					paddingTop: 14
				},
				tabBarInactiveTintColor: theme === 'dark' ? dark.appBaseColorTwo : light.appBaseColorTwo,
				tabBarActiveTintColor: theme === 'dark' ? dark.appBaseColorThree : light.appBaseColorThree,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					headerShown: true,
					header: () => {
						return (
							<View style={tw`bg-transparent`}>
								<MonoText
									style={tw`p-4 absolute text-lg`}
									lightColor={light.appBaseColorTwo}
									darkColor={dark.appBaseColorTwo}
								>{'@' + data?.username}</MonoText>
								<Pressable
									onPress={() => router.push('/profile')}
								>
									<Image
										source={{ uri : data?.avatar_url ?? 'https://picsum.photos/id/237/700/800' }}
										style={tw`h-1/12 aspect-square absolute right-4 top-4 p-4 rounded-full `}
									/>
								</Pressable>
							</View>
						)
					},
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					title: ''
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					headerShown: true,
					header: () => {
						return (
							<Pressable
								style={tw`absolute right-0 p-4`}
								onPress={() => router.push('/settings')}
							>
								<TabBarIcon name="gear" color={theme === 'light' ? light.appBaseColorTwo : dark.appBaseColorTwo} />
							</Pressable>
						)
					},
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
					title: ''
				}}
			/>
		</Tabs>
	)
}
