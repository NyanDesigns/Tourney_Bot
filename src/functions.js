//Randomizer
exports.between = (min, max, decimals) => {
	const str = (Math.random() * (max - min) + min).toFixed(decimals);
	return parseFloat(str);
}

//Difference-Between-2-Arrays
exports.getDifference = (a, b) => {
	return a.filter(element => {
	  return !b.includes(element);
	});
}

//join-two-objects
exports.joinObj = (a, b) => {
	return c = a + b
}