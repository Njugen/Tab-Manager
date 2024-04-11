import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import GenericButton from "../../../components/utils/generic_button";
import WindowManager from "../../../components/features/window_manager/window_manager";
import { Provider, useSelector } from "react-redux";
import { store } from "../../../redux/reducers";
import randomNumber from "../../../tools/random_number";
import { iWindowItem } from "../../../interfaces/window_item";
import { iFolderItem } from "../../../interfaces/folder_item";
import FolderItem from "../../../components/features/folder_item/folder_item";
import { act } from "react-dom/test-utils";

const createMockWindows = (mocks: number): Array<iWindowItem> => {
    const result: Array<iWindowItem> = [];
    
    for(let i = 0; i < mocks; i++){
        const mockWindow: iWindowItem = {
            id: randomNumber(),
            tabs: [],
            tabsCol: 2
        }

        for(let i = 0; i < 10; i++){
            mockWindow.tabs.push({
                id: randomNumber(),
                label: randomNumber().toString(),
                url: `https://${randomNumber()}.com`,
                marked: false,
            });
        }

        result.push(mockWindow);
    }

    return result;
}


describe("Test <FolderItem>", () => {
    describe("When folder is initially expanded ('type' prop set to 'expanded')", () => {
        describe.each(["list", "grid"])("%s mode", (mode: any) => {
            const mockFolderItem: iFolderItem = {
                id: randomNumber(),
                name: randomNumber().toString(),
                desc: randomNumber().toString(),
                marked: false,
                type: "expanded",
                viewMode: mode,
                windows: createMockWindows(5)
            }

            const { id, name, desc, marked, type, viewMode, windows } = mockFolderItem;
    
            test("Folder shows 'name' prop in the heading", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                const heading = within(folderItem).queryByRole("heading", { level: 2 });
                expect(heading).toHaveTextContent(name);
            })

            test("Folder shows description prop", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).toHaveTextContent(desc);
            })

            test(`There are ${mockFolderItem.windows.length} windows listed (windows prop)`, () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                let windowListItem = within(folderItem).getAllByTestId("window-item");

                windowListItem.forEach((window, i) => {
                    expect(window).toBeInTheDocument();
                });

                expect(windowListItem.length).toEqual(mockFolderItem.windows.length);
            })

            test("Open browser option is not visible when 'onOpen' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const openButton = within(folderItem).queryByTestId("open-browser-icon");
                expect(openButton).not.toBeInTheDocument();
            })

            test("Settings option not visible when 'onEdit' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const settingsButton = within(folderItem).queryByTestId("settings-icon");
                expect(settingsButton).not.toBeInTheDocument();
            })

            test("Trash/delete option not visible when 'onDelete' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const deleteButton = within(folderItem).queryByTestId("trash-icon");
                expect(deleteButton).not.toBeInTheDocument();

            })

            test("Checkbox is missing when 'onMark' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const checkbox = within(folderItem).queryByTestId("checkbox");
                expect(checkbox).not.toBeInTheDocument();
            })

            test("Collapsing folder hides the windows and description", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const collapseButton = within(folderItem).getAllByTestId("collapse-icon");
                fireEvent.click(collapseButton[0], { bubbles: true });

                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).not.toBeInTheDocument();

                let windowListItem = within(folderItem).queryAllByTestId("window-item");
                expect(windowListItem.length).toEqual(0);
            })

            test("Expanding folder hides the windows and description", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} type="collapsed" />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const expandButton = within(folderItem).getAllByTestId("collapse-icon");
                fireEvent.click(expandButton[0], { bubbles: true });

                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).toBeInTheDocument();

                let windowListItem = within(folderItem).queryAllByTestId("window-item");
                expect(windowListItem.length).toEqual(mockFolderItem.windows.length);
                
            })

            describe("Focus on the launch/open folder button", () => {
                test("Folder open button is visible when 'onOpen' prop is provided", async () => {
                    mockFolderItem.onOpen = jest.fn((e: Array<iWindowItem>, type: string): void => {});
    
                    jest.useFakeTimers();
    
                    render(
                        <Provider store={store}>
                            <FolderItem {...mockFolderItem} />
                        </Provider>
                    )
                    
                    const folderItem = screen.getByTestId("folder-item");
                    let openButton = within(folderItem).getByTestId("open-browser-icon");
                    expect(openButton).toBeInTheDocument();
                })

                test("Launching option sequence through submenu works", async () => {
                    mockFolderItem.onOpen = jest.fn((e: Array<iWindowItem>, type: string): void => {});
    
                    const { onOpen } = mockFolderItem;
    
                    jest.useFakeTimers();
    
                    render(
                        <Provider store={store}>
                            <FolderItem {...mockFolderItem} />
                        </Provider>
                    )
                    
                    const folderItem = screen.getByTestId("folder-item");

                    ////////// START: Test the open folder button and all of its buttons
                    for(let i = 0; i < 3; i++){
                        /* Click the open button */
                        let openButton = within(folderItem).getByTestId("open-browser-icon");
                        fireEvent.click(openButton, { bubbles: true });
                        
                        /* make sure the launch options are visible */
                        let openFolderOptionsMenu = within(folderItem).getByTestId("open-folder-options");

    
                        /* Click a launch options */
                        let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
                        fireEvent.click(optionsButton[i], { bubbles: true });
    
                        /* Once options have been clicked, make sure appropriate callback has been called */
                        expect(onOpen).toHaveBeenCalled();
    
                        /* Hide the folders options */
                        let updatedFolderOptionsMenu = within(folderItem).queryByTestId("open-folder-options")
                        expect(updatedFolderOptionsMenu).not.toBeInTheDocument();
    
                        /* Click the open button again */
                        fireEvent.click(openButton, { bubbles: true });
    
                        /* Make sure the launch options are visible again */
                        openFolderOptionsMenu = within(folderItem).getByTestId("open-folder-options");
                        expect(openFolderOptionsMenu).toBeInTheDocument();
    
                        ////////// END
                        
                    }
    
                })
            })

            test("Checkbox is visible and works when 'onMark' prop is provided", () => {
                mockFolderItem.onMark = jest.fn((e: number): void => {});
                const { onMark } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                const checkbox = within(folderItem).getByTestId("checkbox");
                fireEvent.click(checkbox, { bubbles: true });
                expect(onMark).toHaveBeenCalled();
            })

            test("Settings button is visible and works when 'onEdit' prop is provided", () => {
                mockFolderItem.onEdit = jest.fn((e: number): void => {});

                const { onEdit } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const settingsButton = within(folderItem).getByTestId("settings-icon");
                fireEvent.click(settingsButton, { bubbles: true });
                expect(onEdit).toHaveBeenCalled();
            })

            test("Trash/delete button is visible and works when 'onDelete' is provided", () => {
                mockFolderItem.onDelete = jest.fn((e: iFolderItem): void => {});

                const { onDelete } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const deleteButton = within(folderItem).getByTestId("trash-icon");
                fireEvent.click(deleteButton, { bubbles: true });
                expect(onDelete).toHaveBeenCalled();
            })

        })
    })

    describe("When folder is initially collapsed ('type' prop is set to 'collapsed'", () => {
        describe.each(["list", "grid"])("%s mode", (mode: any) => {
            const mockFolderItem: iFolderItem = {
                id: randomNumber(),
                name: randomNumber().toString(),
                desc: randomNumber().toString(),
                marked: false,
                type: "collapsed",
                viewMode: mode,
                windows: createMockWindows(5)
            }

            const { id, name, desc, marked, type, viewMode, windows } = mockFolderItem;
    
            test("Folder shows 'name' prop in the heading", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                const heading = within(folderItem).queryByRole("heading", { level: 2 });
                expect(heading).toHaveTextContent(name);
            })

            test("Folder does not show description prop", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).not.toBeInTheDocument();
            })

            test(`There are no windows listed (no windows provided in prop)`, () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                let windowListItem = within(folderItem).queryAllByTestId("window-item");

                expect(windowListItem.length).toEqual(0);
            })

            test("Open browser option not visible when 'onOpen' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const openButton = within(folderItem).queryByTestId("open-browser-icon");
                expect(openButton).not.toBeInTheDocument();
            })

            test("Settings option not visible when 'onEdit' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const settingsButton = within(folderItem).queryByTestId("settings-icon");
                expect(settingsButton).not.toBeInTheDocument();
            })

            test("Trash/delete option not visible when 'onDelete' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const deleteButton = within(folderItem).queryByTestId("trash-icon");
                expect(deleteButton).not.toBeInTheDocument();

            })

            test("Checkbox is missing when 'onMark' prop is missing", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const checkbox = within(folderItem).queryByTestId("checkbox");
                expect(checkbox).not.toBeInTheDocument();
            })

            test("Expanding folder shows the windows and description", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const expandButton = within(folderItem).getAllByTestId("collapse-icon");
                fireEvent.click(expandButton[0], { bubbles: true });

                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).toBeInTheDocument();

                let windowListItem = within(folderItem).queryAllByTestId("window-item");
                expect(windowListItem.length).toEqual(mockFolderItem.windows.length);
            })

            describe("Focus on the launch/open folder button", () => {
                test("Folder open button is visible when 'onOpen' prop is provided", async () => {
                    mockFolderItem.onOpen = jest.fn((e: Array<iWindowItem>, type: string): void => {});
    
                    jest.useFakeTimers();
    
                    render(
                        <Provider store={store}>
                            <FolderItem {...mockFolderItem} />
                        </Provider>
                    )
                    
                    const folderItem = screen.getByTestId("folder-item");
                    let openButton = within(folderItem).getByTestId("open-browser-icon");
                    expect(openButton).toBeInTheDocument();
                })

                test("Launching option sequence through submenu works", async () => {
                    mockFolderItem.onOpen = jest.fn((e: Array<iWindowItem>, type: string): void => {});
    
                    const { onOpen } = mockFolderItem;
    
                    jest.useFakeTimers();
    
                    render(
                        <Provider store={store}>
                            <FolderItem {...mockFolderItem} />
                        </Provider>
                    )
                    
                    const folderItem = screen.getByTestId("folder-item");

                    ////////// START: Test the open folder button and all of its buttons
                    for(let i = 0; i < 3; i++){
                        /* Click the open button */
                        let openButton = within(folderItem).getByTestId("open-browser-icon");
                        fireEvent.click(openButton, { bubbles: true });
                        
                        /* make sure the launch options are visible */
                        let openFolderOptionsMenu = within(folderItem).getByTestId("open-folder-options");

    
                        /* Click a launch options */
                        let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
                        fireEvent.click(optionsButton[i], { bubbles: true });
    
                        /* Once options have been clicked, make sure appropriate callback has been called */
                        expect(onOpen).toHaveBeenCalled();
    
                        /* Hide the folders options */
                        let updatedFolderOptionsMenu = within(folderItem).queryByTestId("open-folder-options")
                        expect(updatedFolderOptionsMenu).not.toBeInTheDocument();
    
                        /* Click the open button again */
                        fireEvent.click(openButton, { bubbles: true });
    
                        /* Make sure the launch options are visible again */
                        openFolderOptionsMenu = within(folderItem).getByTestId("open-folder-options");
                        expect(openFolderOptionsMenu).toBeInTheDocument();
    
                        ////////// END
                        
                    }
    
                })
            })

            test("Checkbox is visible and works when 'onMark' prop is provided", () => {
                mockFolderItem.onMark = jest.fn((e: number): void => {});
                const { onMark } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                const checkbox = within(folderItem).getByTestId("checkbox");
                fireEvent.click(checkbox, { bubbles: true });
                expect(onMark).toHaveBeenCalled();
            })

            test("Settings button is visible and works when 'onEdit' prop is provided", () => {
                mockFolderItem.onEdit = jest.fn((e: number): void => {});

                const { onEdit } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const settingsButton = within(folderItem).getByTestId("settings-icon");
                fireEvent.click(settingsButton, { bubbles: true });
                expect(onEdit).toHaveBeenCalled();
            })

            test("Trash/delete button is visible and works when 'onDelete' is provided", () => {
                mockFolderItem.onDelete = jest.fn((e: iFolderItem): void => {});

                const { onDelete } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const deleteButton = within(folderItem).getByTestId("trash-icon");
                fireEvent.click(deleteButton, { bubbles: true });
                expect(onDelete).toHaveBeenCalled();
            })

        })
    })
});