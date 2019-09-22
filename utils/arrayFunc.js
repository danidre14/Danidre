function limitArr(arr, c) {
    return arr.filter((x, i) => {
        if(i <= (c - 1)) {
            return true;
        }
    })
}
function skipArr(arr, c) {
    return arr.filter((x, i) => {
        if(i > (c-i)) {
            return true;
        }
    })
}
function skipLimitArr(arr, skip, limit) {
    const a = skipArr(arr, skip);
    const b = limitArr(a, limit);
    return b;
}
function limitSkipArr(arr, limit, skip) {
    const a = limitArr(arr, limit);
    const b = skipArr(a, skip);
    return b;
}

module.exports = {
    limitArr: limitArr,
    skipArr: skipArr,
    limitSkipArr: limitSkipArr,
    skipLimitArr: skipLimitArr
};
