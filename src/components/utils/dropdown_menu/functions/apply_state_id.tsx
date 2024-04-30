// Create a unique id based on tag, value and selected option id. E.g. can be used to identify an option
const applyStateValue = (tag: string, value: number, selected : number | null): string => {
    if(selected === value){
        return `${tag}-option-${value}-active`;
    }
    
    return `${tag}-option-${value}`;
}

export default applyStateValue;