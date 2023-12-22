function formatDate(dateString: string) {
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' } as unknown as Intl.DateTimeFormatOptions
	const date = new Date(dateString)
	return new Intl.DateTimeFormat('en-US', options).format(date)
}

export { formatDate}