const compareHistoryItemByTime = (a: chrome.history.HistoryItem, b: chrome.history.HistoryItem) => {
    let comparison: number;

    if(a.lastVisitTime && b.lastVisitTime){
        comparison = a.lastVisitTime && b.lastVisitTime && (b.lastVisitTime - a.lastVisitTime);
    } else {
        comparison = 0;
    }

    return comparison;
}

export default compareHistoryItemByTime;