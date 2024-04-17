// Purify any object/array
// - If input cannot be parsed, then return it.
// - If JSON conversion back and forth is successful, then return the parsed data
const purify = (input: any): any => {
    try {
        return JSON.parse(JSON.stringify(input));
    } catch(e) {
        return input;
    }
}

export default purify;
