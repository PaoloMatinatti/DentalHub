export const formatDate = (inputDate) => {
	if (!inputDate) return undefined;

	const date = new Date(inputDate);

	if (!date) return undefined;

	const formattedDate = date.toISOString().split("T")[0];

	return formattedDate;
};

export function checkIsPediatric(dateString) {
	var inputDate = new Date(dateString);
	var currentDate = new Date();
	var timeDifference = currentDate.getTime() - inputDate.getTime();
	var thirteenYearsInMilliseconds = 13 * 365 * 24 * 60 * 60 * 1000;
	return timeDifference > thirteenYearsInMilliseconds;
}
