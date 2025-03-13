/**
 * Truncates a string to a specified length and appends an ending if the string exceeds that length.
 *
 * @param str - The string to be truncated.
 * @param length - The maximum length of the truncated string, including the ending. Default is 100.
 * @param ending - The string to append to the truncated string if it exceeds the specified length. Default is "...".
 * @returns The truncated string with the ending appended if necessary.
 */
export const truncate = (str: string, length = 100, ending = '...'): string =>
	str.length > length ? str.substring(0, length - ending.length) + ending : str

/**
 * Truncates an address to show only the first 6 and last 4 characters, with "..." in between.
 *
 * @param str - The address to be truncated.
 * @returns The truncated address.
 */
export const truncateAddress = (str: string): string => `${str.slice(0, 6)}...${str.slice(-4)}`
