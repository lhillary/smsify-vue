export const calculateTimeDifference = (sentAt: string, receivedAt: string): string => {
	const sentDate = new Date(sentAt);
	const receivedDate = new Date(receivedAt);
	const diff = receivedDate.getTime() - sentDate.getTime();
	return `${ Math.floor(diff / 60000) } minutes`;
};

// Anything with a status that isn't 'active' gets a muted/grayed-out treatment in the UI.
export const isActiveStatus = (status?: string): boolean => (status ?? '').toLowerCase() === 'active';