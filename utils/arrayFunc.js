function limitArr(arr, c) {
    return arr.slice(0, c);
}
function skipArr(arr, c) {
    return arr.slice(c);
}
function skipLimitArr(arr, skip, limit) {
    return arr.slice(skip, limit + skip);
}
function limitSkipArr(arr, limit, skip) {
    return arr.slice(skip, limit);
}


module.exports = {
    limitArr: limitArr,
    skipArr: skipArr,
    limitSkipArr: limitSkipArr,
    skipLimitArr: skipLimitArr
};
