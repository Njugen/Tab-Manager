const applyStateValue = (tag: string, value: number, selected : number | null): string => {
    if(selected === value){
        return `${tag}-option-${value}-active`;
    }
    
    return `${tag}-option-${value}`;
}

export default applyStateValue;