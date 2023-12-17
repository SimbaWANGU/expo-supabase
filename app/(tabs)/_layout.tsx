import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { light, dark } from '../../src/constants/Colors'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
	return <FontAwesome size={24} {...props} />
}

export default function TabLayout() {
	const colorScheme = useColorScheme()

	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colorScheme === 'dark' ? dark.background : light.background,
					// borderTopColor: colorScheme === 'dark' ? dark.appBaseColor : light.appBaseColor,
					borderTopWidth: 0,
					paddingTop: 14
				},
				tabBarActiveTintColor: colorScheme === 'dark' ? dark.appBaseColor : light.appBaseColor,
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
		</Tabs>
	)
}
