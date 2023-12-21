import React, { useContext, useState } from 'react'
import { Image } from 'react-native'
import tw from 'twrnc'
import { View } from '../../src/components/Themed'
import { light, dark } from '../../src/constants/Colors'
import { SessionContext } from '../../src/context/SessionContext'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../src/utils/Supabase'
import { MonoText, QuickSandText } from '../../src/components/StyledText'
import { UserProfile } from '../../src/interface/interface'

const profile = () => {
	const session = useContext(SessionContext)
	const [username, setUsername] = useState<string | undefined | null>('')
	const [avatar, setAvatar] = useState<string | undefined | null>('https://picsum.photos/id/237/700/800')
	const [bio, setBio] = useState<string | undefined | null>('')
	const [, setExpoPushToken] = useState<string | undefined | null>('')
	const { isPending, error } = useQuery({
		queryKey: [`user-${session?.user.id}`],
		queryFn: async () => {
			try {
				const { data, error, status } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single()
				if (error && status !== 406) return {} as UserProfile
				if (data) {
					setUsername(data.username)
					setAvatar(data.avatar ?? 'https://picsum.photos/id/237/700/800')
					setBio(data.bio)
					setExpoPushToken(data.expoPushToken)
					return data as UserProfile
				}
			} catch (error) {
				console.log('error', error)
				return {} as UserProfile
			}
		}
	})

	if (isPending) return <></>
	if (error) return <></>

	return (
		<View
			style={[tw`h-full w-full items-center p-2 flex flex-col`]}
			lightColor={light.background}
			darkColor={dark.background}
		>
			<View style={tw`h-3/12 w-full flex flex-col pt-10`}>
				<View style={tw`flex flex-row w-full justify-between items-center border-b-2`}>
					<Image
						source={{ uri: avatar ?? 'https://picsum.photos/id/237/700/800' }}
						style={tw`h-3/4 aspect-square rounded-full left-0 `}
					/>
					<View style={tw`flex flex-col text-right`}>
						<MonoText
							lightColor={light.appBaseColorTwo}
							darkColor={dark.text}
							style={tw`text-2xl`}
						>{`@${username}` ?? '@username'}</MonoText>
						<QuickSandText
							lightColor={light.appBaseColorThree}
							darkColor={dark.appBaseColorThree}
							style={tw`text-lg`}
						>{session?.user.email}</QuickSandText>
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
		</View>
	)
}

export default profile