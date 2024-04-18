interface iHandleShowResultsContainerProps {
    searchResultsContainerRef: React.RefObject<HTMLDivElement>,
    showResultsContainer: boolean,
    slideDown: boolean,
    handleSlideDown: (e: boolean) => void,
    setShowResultsContainer: React.Dispatch<React.SetStateAction<boolean>>
}

export default iHandleShowResultsContainerProps;