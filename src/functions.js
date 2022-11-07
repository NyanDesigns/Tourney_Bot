//Randomizer
exports.between = (min, max, decimals) => {
	const str = (Math.random() * (max - min) + min).toFixed(decimals);
	return parseFloat(str);
}