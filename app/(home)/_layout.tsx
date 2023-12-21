import React, { useContext } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import tw from 'twrnc'
import { Redirect, Tabs, router } from 'expo-router'
import { Pressable, useColorScheme } from 'react-native'
import { light, dark } from '../../src/constants/Colors'
import { SessionContext } from '../../src/context/SessionContext'

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
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					title: ''
				}}
			/>
			<Tabs.Screen
				name="leaderboard"
				options={{
					headerShown: false,
					title: '',
					tabBarIcon: ({ color }) => <TabBarIcon name="play" color={color} />,
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
