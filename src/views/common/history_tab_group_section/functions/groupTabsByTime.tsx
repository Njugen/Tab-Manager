// Grouping and sorting tabs by latest to oldest
const groupTabsByTime = (historyTabs: Array<JSX.Element>): Map<number, Array<chrome.history.HistoryItem>> => {
    const groups: Map<number, Array<chrome.history.HistoryItem>> = new Map();

    historyTabs.forEach((tab: any) => {
        const { lastVisitTime } = tab;

        if(lastVisitTime){
            const diff: number = (Date.now() - (lastVisitTime))/1000/60; // in min
            const minutes = Math.floor(diff)

            if(!groups.get(minutes)){
                groups.set(minutes, []);
            }
            const batch: Array<chrome.history.HistoryItem> | undefined = groups.get(minutes);
            
            if(batch){
                batch.push(tab);
                const sorted = batch.sort((a, b) => b.lastVisitTime! - a.lastVisitTime!);
                groups.set(minutes, [...sorted]);
            }
        }
    })

    return groups;
}

const getTabGroups = (historyTabs: Array<JSX.Element>) => {
    const groups: Map<number, Array<chrome.history.HistoryItem>> = groupTabsByTime(historyTabs);

    return Array.from(groups);
}

export default getTabGroups;