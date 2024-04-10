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
    describe("When folder is initially expanded", () => {
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
    
            test("Folder renders correctly with options bar and can be collapsed", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                const heading = within(folderItem).queryByRole("heading", { level: 2 });
                expect(heading).toHaveTextContent(name);

                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).toHaveTextContent(desc);

                let windowListItem = within(folderItem).queryAllByTestId("window-item");

                windowListItem.forEach((window, i) => {
                    expect(window).toBeInTheDocument();
                });

                const openButton = within(folderItem).queryByTestId("open-browser-icon");
                expect(openButton).not.toBeInTheDocument();

                const settingsButton = within(folderItem).queryByTestId("settings-icon");
                expect(settingsButton).not.toBeInTheDocument();

                const deleteButton = within(folderItem).queryByTestId("trash-icon");
                expect(deleteButton).not.toBeInTheDocument();

                const checkbox = within(folderItem).queryByTestId("checkbox");
                expect(checkbox).not.toBeInTheDocument();

                const collapseButton = within(folderItem).getAllByTestId("collapse-icon");
                fireEvent.click(collapseButton[0], { bubbles: true });

                paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).not.toBeInTheDocument();

                windowListItem = within(folderItem).queryAllByTestId("window-item");
                expect(windowListItem.length).toEqual(0);
            })

            test("Folder renders with a working launch folder icon", async () => {
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
                    expect(openFolderOptionsMenu).toBeInTheDocument();

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

                /* Once clicked outside the options menu, hide the options */
                fireEvent.click(window);

                act(() => {
                    jest.runAllTimers();
                });
                fireEvent.click(window);
                
                let updatedFolderOptionsMenu = within(folderItem).queryByTestId("open-folder-options")
                expect(updatedFolderOptionsMenu).not.toBeInTheDocument();
                jest.useRealTimers();
            })

            test("Folder renders with working mark, edit and delete buttons", () => {
                mockFolderItem.onMark = jest.fn((e: number): void => {});
                mockFolderItem.onEdit = jest.fn((e: number): void => {});
                mockFolderItem.onDelete = jest.fn((e: iFolderItem): void => {});

                const { onMark, onEdit, onDelete } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const settingsButton = within(folderItem).getByTestId("settings-icon");
                fireEvent.click(settingsButton, { bubbles: true });
                expect(onEdit).toHaveBeenCalled();

                const deleteButton = within(folderItem).getByTestId("trash-icon");
                fireEvent.click(deleteButton, { bubbles: true });
                expect(onDelete).toHaveBeenCalled();

                const checkbox = within(folderItem).getByTestId("checkbox");
                fireEvent.click(checkbox, { bubbles: true });
                expect(onMark).toHaveBeenCalled();
            })

        })
    })

    describe("When folder is initially collapsed", () => {
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
    
            test("Folder renders correctly with options bar and can be expanded", () => {
                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");
                const heading = within(folderItem).queryByRole("heading", { level: 2 });
                expect(heading).toHaveTextContent(name);

                let paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).not.toBeInTheDocument();

                let windowListItem = within(folderItem).queryAllByTestId("window-item");

                windowListItem.forEach((window, i) => {
                    expect(window).not.toBeInTheDocument();
                });

                const openButton = within(folderItem).queryByTestId("open-browser-icon");
                expect(openButton).not.toBeInTheDocument();

                const settingsButton = within(folderItem).queryByTestId("settings-icon");
                expect(settingsButton).not.toBeInTheDocument();

                const deleteButton = within(folderItem).queryByTestId("trash-icon");
                expect(deleteButton).not.toBeInTheDocument();

                const checkbox = within(folderItem).queryByTestId("checkbox");
                expect(checkbox).not.toBeInTheDocument();

                const collapseButton = within(folderItem).getAllByTestId("collapse-icon");
                fireEvent.click(collapseButton[0], { bubbles: true });

                paragraph = within(folderItem).queryByText(desc, {selector: "p"});
                expect(paragraph).toHaveTextContent(desc);

                windowListItem = within(folderItem).queryAllByTestId("window-item");
                windowListItem.forEach((window, i) => {
                    expect(window).toBeInTheDocument();
                });
            })

            test("Folder renders with a working launch folder icon", () => {
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
                    expect(openFolderOptionsMenu).toBeInTheDocument();

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
                    
                }
                ////////// END

               
                /* Once clicked outside the options menu, hide the options */
                fireEvent.click(window);

                act(() => {
                    jest.runAllTimers();
                });
                fireEvent.click(window);

                let updatedFolderOptionsMenu = within(folderItem).queryByTestId("open-folder-options")
                expect(updatedFolderOptionsMenu).not.toBeInTheDocument();
                jest.useRealTimers();
            })

            test("Folder renders with working mark, edit and delete buttons", () => {
                mockFolderItem.onMark = jest.fn((e: number): void => {});
                mockFolderItem.onEdit = jest.fn((e: number): void => {});
                mockFolderItem.onDelete = jest.fn((e: iFolderItem): void => {});

                const { onMark, onEdit, onDelete } = mockFolderItem;

                render(
                    <Provider store={store}>
                        <FolderItem {...mockFolderItem} />
                    </Provider>
                )
                
                const folderItem = screen.getByTestId("folder-item");

                const settingsButton = within(folderItem).getByTestId("settings-icon");
                fireEvent.click(settingsButton, { bubbles: true });
                expect(onEdit).toHaveBeenCalled();

                const deleteButton = within(folderItem).getByTestId("trash-icon");
                fireEvent.click(deleteButton, { bubbles: true });
                expect(onDelete).toHaveBeenCalled();

                const checkbox = within(folderItem).getByTestId("checkbox");
                fireEvent.click(checkbox, { bubbles: true });
                expect(onMark).toHaveBeenCalled();
            })

        })
    })
});