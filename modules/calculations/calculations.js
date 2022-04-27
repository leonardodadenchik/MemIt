const differentNums = (maxValue, count) => {
	const getSet = (mySet) => {
		return mySet.size >= count
			? mySet
			: getSet(mySet.add(randInt(0, maxValue)));
	};

	return Array.from(getSet(new Set()));
};


const randInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};
module.exports = {
	differentNums,
}
