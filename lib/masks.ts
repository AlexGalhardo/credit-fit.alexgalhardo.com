export const applyCpfMask = (value: string): string => {
	const numbers = value.replace(/\D/g, "");
	return numbers
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
};

export const applyCnpjMask = (value: string): string => {
	const numbers = value.replace(/\D/g, "");
	return numbers
		.replace(/(\d{2})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1/$2")
		.replace(/(\d{4})(\d{1,2})/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
};

export const applyCurrencyMask = (value: string): string => {
	const numbers = value.replace(/\D/g, "");
	if (!numbers) return "";

	const amount = parseInt(numbers) / 100;
	return amount.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const removeMask = (value: string): string => {
	return value.replace(/\D/g, "");
};
