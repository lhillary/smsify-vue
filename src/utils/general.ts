export const calculateTimeDifference = (sentAt: string, receivedAt: string): string => {
	const sentDate = new Date(sentAt);
	const receivedDate = new Date(receivedAt);
	const diff = receivedDate.getTime() - sentDate.getTime();
	return `${ Math.floor(diff / 60000) } minutes`;
};