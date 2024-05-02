const randomNumber = (): number => {
	const randomFloat = Math.random() * 20000000;
	const result = Math.floor(randomFloat);

	return result;
};

export default randomNumber;
