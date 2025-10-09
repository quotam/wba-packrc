'use server'

export const ClientErrorHandleAction = async (err: string) => {
	console.error({ err }, '[CLIENT ERROR]')
}
