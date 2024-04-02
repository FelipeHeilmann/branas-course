export function validate (rawCpf: string) {
	if (!rawCpf) return false;
	const cpf = removeNonDigits(rawCpf);
	if (!isValidLenght(cpf)) return false;
	if (isAllDigitsEqual(cpf)) return false
	const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
	const secondDigit = calculateDigit(cpf.slice(0, 9) + firstDigit, 11);
	return `${firstDigit}${secondDigit}` === cpf.slice(9);
}

function removeNonDigits(cpf: string) { 
	return cpf.replace(/\D/g, '');
}

function isValidLenght(cpf:string) {
	return cpf.length === 11;
}

function isAllDigitsEqual(cpf: string) {
	const [firstDigit] = cpf;
	return cpf.split("").every(digit => digit === firstDigit)
}

function calculateDigit(cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		total += Number(digit) * factor--;
	}
	const remainder = total % 11;
	return remainder < 2 ? 0 : 11 - remainder;
}
