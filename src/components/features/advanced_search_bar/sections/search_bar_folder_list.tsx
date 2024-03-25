import { iFolderItem } from '../../../../interfaces/folder_item';
import { iWindowItem } from '../../../../interfaces/window_item';
import FolderItem from '../../folder_item/sections/folder_item';
import { filterFoldersByString } from '../filters';

interface ISearchBarFolderListProps {
    items: Array<iFolderItem>,
    keyword: string,
    handleOpen: (windows: Array<iWindowItem>, type: string) => void
}

const SearchBarFolderList = (props: ISearchBarFolderListProps): JSX.Element => {
    const { items, keyword, handleOpen } = props;

    const folders: Array<iFolderItem> = filterFoldersByString(items, keyword);

    if(folders.length > 0){
        const list: Array<JSX.Element> = folders.map((folder: iFolderItem) => {
            const {id, name, desc, windows} = folder;

            return <FolderItem 
                key={`folder-sr-key-${id}`} 
                marked={false} 
                id={id!} 
                name={name} 
                viewMode={"list"} 
                type={"collapsed"} 
                desc={desc} 
                windows={windows} 
                onOpen={handleOpen} 
            />
        });

        return <>{list}</>
    }
    
    return (
        <p className="text-center p-2">There are no results in this section</p>
    );
    
}

export default SearchBarFolderList;