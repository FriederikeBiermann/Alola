/**
 * Splits an array into pairs and logs the result.
 * @param {Array} array - The input array to be split into pairs.
 * @returns {Array} An array of pair arrays.
 */
export function splitArrayIntoPairs(array) {
    const pairs = [];
    for (let i = 0; i < array.length; i += 2) {
        if (i + 1 >= array.length) {
            break;
        }
        pairs.push([array[i], array[i + 1]]);
    }
    console.log(pairs);
    return pairs;
}

/**
 * Converts a string representation of an array to an actual array.
 * @param {string} string - The string representation of an array.
 * @returns {Array} The resulting array.
 */
export function stringToArray(string) {
    return string
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll(" ", "")
        .replaceAll("'", "")
        .split(",");
}

/**
 * Finds a button element by its text content.
 * @param {string} text - The text content to search for.
 * @returns {HTMLButtonElement|null} The found button element or null if not found.
 */
export function findButtonByTextContent(text) {
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].firstChild.nodeValue === text) {
            return buttons[i];
        }
    }
    return null;
}

/**
 * Removes all instances of an item from an array.
 * @param {Array} arr - The array to modify.
 * @param {*} item - The item to remove from the array.
 * @returns {Array} The modified array.
 */
export function removeAllInstances(arr, item) {
    return arr.filter(element => element !== item);
}

/**
 * Adds a string in front of every element in the array.
 * @param {string} string - The string to be added.
 * @param {Array} array - The array to modify.
 * @returns {Array} A new array with the specified string added in front of each element.
 */
export function addStringToArray(string, array) {
    return array.map(value => string + value);
}

/**
 * Removes padding from the BGC object.
 * @param {Object} BGC - The BGC object to modify.
 * @returns {Object} A new BGC object without padding.
 */
export function removePaddingBGC(BGC) {
    let BGC_with_padding = JSON.parse(JSON.stringify(BGC));
    if (BGC_with_padding.orfs.length !== 0) {
        if (BGC_with_padding.orfs[0].start !== 0) {
            for (let orfIndex = 0; orfIndex < BGC_with_padding.orfs.length; orfIndex++) {
                BGC_with_padding.orfs[orfIndex].start = BGC_with_padding.orfs[orfIndex].start - BGC.start;
                BGC_with_padding.orfs[orfIndex].end = BGC_with_padding.orfs[orfIndex].end - BGC.start;
            }
        }
    }
    return BGC_with_padding;
}

/**
 * Removes space between proteins in the BGC object.
 * @param {Object} BGC - The BGC object to modify.
 * @returns {Object} A new BGC object without space between proteins.
 */
export function removeSpaceBetweenProteins(BGC) {
    let BGC_without_space = JSON.parse(JSON.stringify(BGC));
    for (let orfIndex = 0; orfIndex < BGC_without_space.orfs.length; orfIndex++) {
        let orf_length = BGC_without_space.orfs[orfIndex].end - BGC_without_space.orfs[orfIndex].start;
        BGC_without_space.orfs[orfIndex].start = 0;
        BGC_without_space.orfs[orfIndex].end = BGC_without_space.orfs[orfIndex].start + orf_length;
    }
    return BGC_without_space;
}

/**
 * Finds the function of an ORF from its description.
 * @param {string} orfDescription - The description of the ORF.
 * @returns {string} The function of the ORF.
 */
export function findFunctionOrf(orfDescription) {
    let positionBegin = orfDescription.search("\n \n") + 5;
    let positionEnd = orfDescription.search("Locus tag") - 14;
    return orfDescription.slice(positionBegin, positionEnd).toLowerCase();
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param {number} number - The number to round.
 * @param {number} decimals - The number of decimal places to round to.
 * @returns {number} The rounded number.
 */
export function roundToDecimal(number, decimals) {
    return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
} 
