import SearchIcon from "../icons/search_icon";
import iSimpleSearchBar from "../../interfaces/simple_search_bar";

const SimpleSearchBar = (props: iSimpleSearchBar): JSX.Element => {
    const { onChange } = props;

    return (
        <div className={`w-full flex items-center relative  z-[501] text-sm h-10 opacity-50 bg-gray-200 focus:opacity-90 border-tbfColor-lightergrey focus:outline-0 focus:outline-tbfColor-lighterpurple4 focus:shadow-md py-5 pr-5 rounded-3xl`}>
            <div data-testid="te" className="ml-4 mr-2 z-[502]">
                <SearchIcon fill={"#5c5c5c"} size={24} />
            </div>
            <input 
                data-testid="search-field" 
                id="search-field" 
                defaultValue="Search..." 
                onChange={onChange} 
                className={`bg-gray-200 w-full focus:outline-0`} 
                type="text" 
            />
        </div>
    )
}

export default SimpleSearchBar;