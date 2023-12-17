/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import React from 'react'
import { Text as DefaultText, useColorScheme, View as DefaultView } from 'react-native'

import { light, dark } from '../constants/Colors'

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof light & keyof typeof dark
) {
	const theme = useColorScheme() ?? 'light'
	const colorFromProps = theme === 'light' ? props.light : props.dark

	if (colorFromProps) {
		return colorFromProps
	} else {
		return theme === 'light' ? light[colorName] : dark[colorName]
	}
}

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

	return <DefaultText style={[{ color }, style]} {...otherProps} />
}

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
}
