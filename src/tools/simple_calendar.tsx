import { useState } from "react";
import { iFieldOption } from "../interfaces/dropdown";
import Dropdown from "../components/utils/dropdown/dropdown";
import { iDropdownSelected } from "../interfaces/dropdown";

const SimpleCalendar = (props: any) => {
    const currentYear: number = new Date().getFullYear();
    const currentMonth: number = new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
    const { month, year, onSelectDate } = props;
    
    const days: Array<{ number: number }> = [];
    let offset: Array<any> = [];

    const dateOffset = (year: number, month: number): number => {
        const time = new Date(year, month-1);
        const day = time.toString().substring(0,3).toLowerCase();
        let dateOffset = 0;

        if(day === "mon"){
            dateOffset = 0;
        } else if(day === "tue"){
            dateOffset = 1;
        } else if(day === "wed"){
            dateOffset = 2;
        } else if(day === "thu"){
            dateOffset = 3;
        } else if(day === "fri"){
            dateOffset = 4;
        } else if(day === "sat"){
            dateOffset = 5;
        } else if(day === "sun"){
            dateOffset = 6;
        }

        return dateOffset;
    }

    const lastDateOfMonth = (year: number, month: number): number => {
        const day = new Date(year, month, 0);
        return day.getDate();
    }

    for(let i = 1; i <= lastDateOfMonth(selectedYear, selectedMonth); i++){
        days.push({ number: i });
    }
    
    //Now, offset
    for(let i = 1; i <= dateOffset(selectedYear, selectedMonth); i++){
        offset.push({number: "", ins: i})
    }

    const slots = [...offset, ...days];

    const handleSelectDate = (date: number): void => {
        const timestamp = new Date(year, month, date);
        onSelectDate(timestamp);
    }

    /**********
     *  
     * Year selector data
     * 
     * *********/
    const yearOptionsList: Array<iFieldOption> = [];

    for(let i = 0; i <= 8; i++){
        yearOptionsList.push({
            id: (currentYear-i),
            label: (currentYear-i).toString()
        })
    }

    const presetYearOption: iFieldOption | null = yearOptionsList.find((option) => option.id === selectedYear) || yearOptionsList[0];

    /**********
     *  
     * Month selector data
     * 
     * *********/
    
    const monthsAsString: Array<string> = [
        "January",
        "February",
        "Mars",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const monthOptionsList: Array<iFieldOption> = monthsAsString.map((target: string, i: number) => { 
        return { id: i+1, label: target }
    });

    const presetMonthOption: iFieldOption | null = monthOptionsList.find((option) => option.id === selectedMonth) || monthOptionsList[0];

    return (
        /*
            1 month -> 30-31 days
            1 week -> 7 days
            1 day -> 24 hours
            
            30-31 days / 7 = ~4... -> 5 rows
        */
       
        <div className="max-w-[500px]">
            <div className="flex justify-between">
                <div className={"w-1/5"}>
                    <Dropdown tag={"calendar-month"} preset={presetMonthOption} options={monthOptionsList} onCallback={(data: iDropdownSelected) => {
                        if(data.selected && data.selected > -1) setSelectedMonth(data.selected);
                    }} />
                </div>
                <div className={"w-2/5"}>
                    <Dropdown tag={"calendar-year"} preset={presetYearOption} options={yearOptionsList} onCallback={(data: iDropdownSelected) => {
                        if(data.selected) setSelectedYear(data.selected);
                    }} />
                </div>
                
            </div>
            <div className="grid grid-cols-7 gap-y-2 grid-rows-5 mt-2 text-center bg-white px-4 py-6 rounded-md drop-shadow-no_pos">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayname) => <strong>{dayname}</strong>)}
                {
                    slots.map((day): JSX.Element => {
                        if(day.number){
                            return <button onClick={() => handleSelectDate(day.number)}>{day.number}</button>
                        } else {
                            return <button>{day.number}</button>
                        }
                    })
                }
            </div>
        </div>
    )
}

export default SimpleCalendar;