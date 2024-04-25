/*
    Purify any object/array
    - If input cannot be parsed, then return it.
    - If JSON conversion back and forth is successful, then return the parsed data

    Use this if a framework/api doesn't return objects or arrays in a readable/editable format. E.g. Immer
*/
const purify = (input: any): any => {
    try {
        return JSON.parse(JSON.stringify(input));
    } catch(e) {
        return input;
    }
}

export default purify;
