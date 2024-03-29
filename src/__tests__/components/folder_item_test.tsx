import { fireEvent, render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom'
import { store } from "../../redux/reducers";
import { Provider } from "react-redux";
import { iFolderItem } from "../../interfaces/folder_item";
import FolderItem from "../../components/features/folder_item/folder_item";

jest.mock("../../redux/mocked_hooks");
jest.useFakeTimers();
jest.setTimeout(10000);

const mockOnOpen = jest.fn();
const mockOnMark = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

const rand = (): number => {
    const number: number = Math.floor(Math.random() * 100000000);
    return number;
}

const windowsSettings1 = {
    tabsCol: 2,
    initExpand: true,
    disableMark: true,
    disableEdit: true,
    disableTabMark: true,
    disableTabEdit: true
}

const mockFolder: iFolderItem = {
    id: 0,
    name: rand().toString(),
    desc: rand().toString(),
    marked: false,
    type: "expanded",
    viewMode: "list",
    windows: [
        {
            id: 0,
            tabs: [{
                id: 0,
                label: "Final Fantasy XIV Reddit",
                url: "http://reddit.com",
                marked: false,
            },
            {
                id: 1,
                label: "Linkedin - How to make contacts",
                url: "http://linkedin",
                marked: false,
            }],
            ...windowsSettings1
        },
        {
            id: 0,
            tabs: [{
                id: 0,
                label: "Youtube - Darkwing Duck",
                url: "http://youtube.com",
                marked: false
            }],
            ...windowsSettings1
        }
    ],
    onOpen: mockOnOpen,
    onMark: mockOnMark,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete
}




describe("Test a folder", () => {
    test("Folder behaves ok with handlers", () => {
        const { id, name, desc, marked, type, viewMode, windows } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={viewMode}
                    windows={windows}
                    onOpen={mockOnOpen}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    onMark={mockOnMark}
                />
            </Provider>
        );

        const folderItem = screen.getByTestId("folder-item");
        expect(folderItem).toBeInTheDocument();

        const folderTitle = screen.getByRole("heading", { level: 2 });
        expect(folderTitle).toHaveTextContent(name);

        const folderDesc = screen.queryByTestId("description-section");
        expect(folderDesc).toBeInTheDocument();
        
        const checkBox = screen.queryByTestId("checkbox");
        const checkedIcon = screen.queryByTestId("checked");
        expect(checkBox).toBeInTheDocument();
        expect(checkedIcon).not.toBeInTheDocument();

        const windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(2);

        const tabItems = screen.queryAllByTestId("tab-item");
        expect(tabItems.length).toEqual(3);

        const launchFolderButton = screen.queryByTestId("folder-control-button-open_browser");
        const settingsButton = screen.queryByTestId("folder-control-button-settings");
        const trashButton = screen.queryByTestId("folder-control-button-trash");
        const collapseButton = screen.queryByTestId("folder-control-button-collapse");

        expect(launchFolderButton).toBeInTheDocument();
        expect(settingsButton).toBeInTheDocument();
        expect(trashButton).toBeInTheDocument();
        expect(collapseButton).toBeInTheDocument();
    });

    test("Folder behaves ok without handlers", () => {
        const { id, name, desc, marked, type, viewMode, windows } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={viewMode}
                    windows={windows}
                />
            </Provider>
        );

        const folderItem = screen.getByTestId("folder-item");
        expect(folderItem).toBeInTheDocument();

        const folderTitle = screen.getByRole("heading", { level: 2 });
        expect(folderTitle).toHaveTextContent(name);

        const folderDesc = screen.queryByTestId("description-section");
        expect(folderDesc).toBeInTheDocument();
        
        const checkBox = screen.queryByTestId("checkbox");
        const checkedIcon = screen.queryByTestId("checked");
        expect(checkBox).not.toBeInTheDocument();
        expect(checkedIcon).not.toBeInTheDocument();

        const windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(2);

        const tabItems = screen.queryAllByTestId("tab-item");
        expect(tabItems.length).toEqual(3);

        const launchFolderButton = screen.queryByTestId("folder-control-button-open_browser");
        const settingsButton = screen.queryByTestId("folder-control-button-settings");
        const trashButton = screen.queryByTestId("folder-control-button-trash");
        const collapseButton = screen.queryByTestId("folder-control-button-collapse");

        expect(launchFolderButton).not.toBeInTheDocument();
        expect(settingsButton).not.toBeInTheDocument();
        expect(trashButton).not.toBeInTheDocument();
        expect(collapseButton).toBeInTheDocument();
    });

    test("Collapsed folder does not show windows, tabs nor description", () => {
        const { id, name, desc, marked, type, viewMode, windows } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"collapsed"}
                    viewMode={viewMode}
                    windows={windows}
                />
            </Provider>
        );

        const folderDesc = screen.queryByTestId("description-section");
        expect(folderDesc).not.toBeInTheDocument();

        const windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(0);

        const tabItems = screen.queryAllByTestId("tab-item");
        expect(tabItems.length).toEqual(0);

        const expandButton = screen.getByTestId("folder-control-button-expand");
        expect(expandButton).toBeInTheDocument();
    });

    test("Launch button works", () => {
        const { id, name, desc, marked, type, viewMode, windows, onOpen } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={viewMode}
                    windows={windows}
                    onOpen={mockOnOpen}
                />
            </Provider>
        );

        let dropdown = screen.queryByTestId("folder-control-dropdown");
        expect(dropdown).not.toBeInTheDocument();

        let launchFolderButton = screen.getByTestId("folder-control-button-open_browser");
        fireEvent.click(launchFolderButton);


        dropdown = screen.queryByTestId("folder-control-dropdown");
        expect(dropdown).toBeInTheDocument();

        // HOW TO TEST DROPDOWN HIDE WHEN CLICKING THE WINDOW?
     /*   fireEvent.click(document);
        jest.runAllTimers()

        dropdown = screen.queryByTestId("folder-control-dropdown");
        expect(dropdown).not.toBeInTheDocument();*/
        launchFolderButton = screen.getByTestId("folder-control-button-open_browser");
        fireEvent.click(launchFolderButton);

        expect(dropdown).toBeInTheDocument();

        const dropdownOptions = within(dropdown as HTMLElement).queryAllByRole("listitem");
        expect(dropdownOptions.length).toBeGreaterThan(0);

        const optionButton = within(dropdownOptions[0]).getByRole("button");
        fireEvent.click(optionButton);

        jest.runAllTimers()
        expect(mockOnOpen).toHaveBeenCalled();
        dropdown = screen.queryByTestId("folder-control-dropdown");
        expect(dropdown).not.toBeInTheDocument();
    });

    test("Settings button works", () => {
        const { id, name, desc, marked, type, viewMode, windows, onEdit } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={viewMode}
                    windows={windows}
                    onEdit={onEdit}
                />
            </Provider>
        );

        const settingsButton = screen.getByTestId("folder-control-button-settings");
        fireEvent.click(settingsButton);
        expect(onEdit).toHaveBeenCalled();
    });

    test("Trash button works", () => {
        const { id, name, desc, marked, type, viewMode, windows, onDelete } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={viewMode}
                    windows={windows}
                    onDelete={onDelete}
                />
            </Provider>
        );

        const trashButton = screen.getByTestId("folder-control-button-trash");
        fireEvent.click(trashButton);
        expect(onDelete).toHaveBeenCalled();
    });

    test("Checkbox works", () => {
        const { id, name, desc, marked, type, viewMode, windows, onMark } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={viewMode}
                    windows={windows}
                    onMark={onMark}
                />
            </Provider>
        );

        const checkbox = screen.getByTestId("checkbox");
        let checked = within(checkbox).queryByTestId("checked");

        expect(checkbox).toBeInTheDocument();
        expect(checked).not.toBeInTheDocument();

        fireEvent.click(checkbox);
        checked = within(checkbox).queryByTestId("checked");
        expect(checked).toBeInTheDocument();
        expect(onMark).toHaveBeenCalled();

        fireEvent.click(checkbox);
        checked = within(checkbox).queryByTestId("checked");
        expect(checked).not.toBeInTheDocument();
        expect(onMark).toHaveBeenCalled();
    });

    test("Collapse/Expand buttons work - preset expanded", () => {
        const { id, name, desc, marked, type, viewMode, windows } = mockFolder;
        
        render(
            <Provider store={store}>
                <FolderItem
                    id={id}
                    name={name}
                    desc={desc}
                    marked={marked}
                    type={"expanded"}
                    viewMode={"grid"}
                    windows={windows}
                />
            </Provider>
        );

        let windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(2);

        let collapseButton: any = screen.getByTestId("folder-control-button-collapse");
        expect(collapseButton).toBeInTheDocument();
        fireEvent.click(collapseButton);
        
        windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(0);
        collapseButton = screen.queryByTestId("folder-control-button-collapse");
        expect(collapseButton).not.toBeInTheDocument();

        let expandButton: any = screen.getByTestId("folder-control-button-expand");
        expect(expandButton).toBeInTheDocument();
        fireEvent.click(expandButton);

        windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(2);
        expandButton = screen.queryByTestId("folder-control-button-expand");
        expect(expandButton).not.toBeInTheDocument();

        collapseButton = screen.getByTestId("folder-control-button-collapse");
        fireEvent.click(collapseButton);
        expect(collapseButton).toBeInTheDocument();

        windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(0);
    });
});