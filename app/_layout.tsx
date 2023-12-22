import React, { useEffect } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { dark, light } from '../src/constants/Colors'
import 'react-native-url-polyfill/auto'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { supabase } from '../src/utils/Supabase'
import { SessionProvider } from '../src/context/SessionContext'
import { useColorScheme } from 'react-native'

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const theme = useColorScheme()
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		QuickSand: require('../assets/fonts/Quicksand_Bold.otf'),
		...FontAwesome.font,
	})

	useEffect(() => {
		if (error) throw error
		if (loaded) SplashScreen.hideAsync()
	}, [error, loaded])

	if (!loaded) {
		return null // Render nothing or a loading component until fonts are loaded and auth check is complete
	}

	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaView
				style={{ flex: 1 }}
				edges={['top', 'right', 'left']}
			>
				<App />
			</SafeAreaView>
			<StatusBar
				style={theme === 'light' ? 'dark' : 'light'}
				animated={true}
				backgroundColor={theme === 'light' ? light.background : dark.background}
			/>
		</QueryClientProvider>
	)
}

const App = () => {
	const { isPending, error, data: session } = useQuery({
		queryKey: ['session'],
		queryFn: async () => { 
			const data = await supabase.auth.getSession()
			if (data.data.session) {
				return data.data.session
			} else {
				return null
			}
		} 
	})
	
	useEffect(() => {
		if (error) throw error
		if (!isPending) SplashScreen.hideAsync()
	}, [error, isPending])
	
	if (isPending) return <></>
	if (error) return <></>
	if (session === undefined) return <></>
	return (
		<SessionProvider value={session}>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen
					name={'(home)'}
					options={{ headerShown: false }}
					getId={() => String(Date.now()) }	
				/>
			</Stack>
		</SessionProvider>
	)
}

