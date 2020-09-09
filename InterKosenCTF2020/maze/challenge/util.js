function is_array(obj) {
    return obj !== null && typeof obj === 'object';
}

function __deepcopy_internal(result, array) {
    for (let index in array) {
        if (is_array(result[index]) && is_array(array[index])) {
            __deepcopy_internal(result[index], array[index]);
        } else {
            result[index] = array[index];
        }
    }
    return result;
}

/**
 * deepcopy: Clone an Array object
 */
function deepcopy(obj) {
    return __deepcopy_internal(new Array(), obj);
}

module.exports = {
    deepcopy: deepcopy
};
