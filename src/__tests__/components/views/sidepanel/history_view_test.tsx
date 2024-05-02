import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import mockStore, { mockFolders } from "../../../../tools/testing/mock_store";
import { Provider } from "react-redux";
import mockBrowserStorage from "../../../../tools/testing/mock_browser_storage";
import { act } from "react-dom/test-utils";
import HistoryView from "../../../../views/sidepanel/history_view";
import mockHistoryTabs from "../../../../tools/testing/mock_history";

beforeEach(() => {
    // @ts-expect-error
    chrome.history.search = jest.fn((query, callback: (e: any) => {}): void => {
        callback([...mockHistoryTabs])
    })
    // @ts-expect-error
    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
        callback({...mockBrowserStorage})
    });

    jest.useFakeTimers();
})

afterEach(() => {
    jest.useRealTimers();
})

// Number of tabs to mark
const markCount = 4;


describe("Test <HistoryView>", () => {
    test("All groups have tabs from browser history in them", () => {
        render(
            <Provider store={mockStore}>
                <HistoryView />
            </Provider>
        )

        const groups = screen.getAllByTestId("tab-group");
        groups.forEach((group) => {
            const tabs = within(group).getAllByTestId("tab-item");
            expect(tabs.length).toBeGreaterThan(0);
        })
    })

    test("All mock tab labels exists in the history section", () => {
        render(
            <Provider store={mockStore}>
                <HistoryView />
            </Provider>
        )

        const tabs = screen.getAllByTestId("tab-item");
        expect(tabs.length).toEqual(mockHistoryTabs.length)
    })

    test("'Open selected' button is disabled when rendered", () => {
        render(
            <Provider store={mockStore}>
                <HistoryView />
            </Provider>
        )

        const buttons = screen.getAllByRole("button");
        let target;

        buttons.forEach((button) => {
            const child = within(button).queryByTestId("open-browser-icon");
            if(child){
                target = button;
            }
        })

        expect(target).toBeDisabled();
    })

    test("'Add to folder' button is disabled when rendered", () => {
        render(
            <Provider store={mockStore}>
                <HistoryView />
            </Provider>
        )

        const buttons = screen.getAllByRole("button");
        let target;

        buttons.forEach((button) => {
            const child = within(button).queryByTestId("save-icon");
            if(child){
                target = button;
            }
        })

        expect(target).toBeDisabled();
    })

    test("'Delete from history' button is disabled when rendered", () => {
        render(
            <Provider store={mockStore}>
                <HistoryView />
            </Provider>
        )

        const buttons = screen.getAllByRole("button");
        let target;

        buttons.forEach((button) => {
            const child = within(button).queryByTestId("trash-icon");
            if(child){
                target = button;
            }
        })

        expect(target).toBeDisabled();
    })

    describe("Test marking and interaction with Folder Manager", () => {
        test("Marking and unmarking a tab disables the 'Open selected' button", () => {
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )

            const tabs = screen.getAllByTestId("tab-item");
            let checkbox = within(tabs[0]).getByTestId("checkbox");
            fireEvent.click(checkbox);

            checkbox = within(tabs[0]).getByTestId("checkbox");
            fireEvent.click(checkbox);

            const buttons = screen.getAllByRole("button");
            let target;

            buttons.forEach((button) => {
                const child = within(button).queryByTestId("trash-icon");
                if(child){
                    target = button;
                }
            })

            expect(target).toBeDisabled();
        })

        test("Marking and unmarking a tab disables the 'Add to folder' button", () => {
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )

            const tabs = screen.getAllByTestId("tab-item");
            let checkbox = within(tabs[0]).getByTestId("checkbox");
            fireEvent.click(checkbox);

            checkbox = within(tabs[0]).getByTestId("checkbox");
            fireEvent.click(checkbox);

            const buttons = screen.getAllByRole("button");
            let target;

            buttons.forEach((button) => {
                const child = within(button).queryByTestId("save-icon");
                if(child){
                    target = button;
                }
            })

            expect(target).toBeDisabled();
        })

        test("Marking and unmarking a tab disables the 'Delete from history' button", () => {
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )

            const tabs = screen.getAllByTestId("tab-item");
            let checkbox = within(tabs[0]).getByTestId("checkbox");
            fireEvent.click(checkbox);

            checkbox = within(tabs[0]).getByTestId("checkbox");
            fireEvent.click(checkbox);

            const buttons = screen.getAllByRole("button");
            let target;

            buttons.forEach((button) => {
                const child = within(button).queryByTestId("trash-icon");
                if(child){
                    target = button;
                }
            });

            expect(target).toBeDisabled();
        })

        test("Folder manager contains marked history tabs if user choose to add them to a new folder", () => {
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )

            const tabs = screen.getAllByTestId("tab-item");

            for(let i = 0; i < markCount; i++){
                const checkbox = within(tabs[i]).getByTestId("checkbox");
                fireEvent.click(checkbox);
            }

            const addToFoldericon = screen.getByTestId("save-icon");
            fireEvent.click(addToFoldericon, { bubbles: true });

            // Open dialog, where user selects how he wants to add the tabs
            let dialog = screen.getByRole("dialog");
            const newFolderButton = within(dialog).getByText("To a new folder", { selector: "button" });

            fireEvent.click(newFolderButton);
            
            // Folder manager
            dialog = screen.getByRole("dialog");

            // Number of rendered tabs in folder manager should equal the numbers marked
            const renderedTabs = within(dialog).getAllByTestId("tab-item");

            expect(markCount).toEqual(renderedTabs.length);
            const cancelButton = within(dialog).getByText("Cancel", { selector: "button" });

            fireEvent.click(cancelButton, { bubbles: true });
            act(() => {
                jest.runAllTimers();
            });
        });

        test("Folder manager contains marked history tabs if user choose to add them to an existing folder", () => {
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )

            const tabs = screen.getAllByTestId("tab-item");

            for(let i = 0; i < markCount; i++){
                const checkbox = within(tabs[i]).getByTestId("checkbox");
                fireEvent.click(checkbox);
            }

            const addToFoldericon = screen.getByTestId("save-icon");
            fireEvent.click(addToFoldericon, { bubbles: true });

            // Open dialog, where user selects how he wants to add the tabs
            let dialog = screen.getByRole("dialog");
            const dropdown = screen.getByText("Select a folder", { selector: "button" });
            fireEvent.click(dropdown);

            const options = screen.getAllByRole("listitem")
            const targetOptionButton = within(options[1]).getByRole("button");
            fireEvent.click(targetOptionButton);
            
            // Folder manager
            dialog = screen.getByRole("dialog");

            const renderedTabs = within(dialog).getAllByTestId("tab-item");

            let totalFolderMockTabs = 0;
            mockFolders[0].windows.forEach((window) => {
                totalFolderMockTabs += window.tabs.length;
            })

            expect(markCount + totalFolderMockTabs).toEqual(renderedTabs.length);
            const cancelButton = within(dialog).getByText("Cancel", { selector: "button" });

            fireEvent.click(cancelButton, { bubbles: true });
            act(() => {
                jest.runAllTimers();
            });
        });

        test("Delete tabs feature triggers relevant Browser's API", () => {
            chrome.history.deleteUrl = jest.fn();
    
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )
    
            const tabs = screen.getAllByTestId("tab-item");

            for(let i = 0; i < markCount; i++){
                const checkbox = within(tabs[i]).getByTestId("checkbox");
                fireEvent.click(checkbox);
            }
    
            const trashIcon = screen.getByTestId("trash-icon");
            fireEvent.click(trashIcon, { bubbles: true });

            expect(chrome.history.deleteUrl).toHaveBeenCalled();
        })

        test("Open tabs feature triggers relevant Browser's API", () => {
            chrome.tabs.create = jest.fn();
    
            render(
                <Provider store={mockStore}>
                    <HistoryView />
                </Provider>
            )
            
            const tabs = screen.getAllByTestId("tab-item");

            for(let i = 0; i < markCount; i++){
                const checkbox = within(tabs[i]).getByTestId("checkbox");
                fireEvent.click(checkbox);
            }
    
            const openBrowserIcon = screen.getByTestId("open-browser-icon");
            fireEvent.click(openBrowserIcon, { bubbles: true });
    
            expect(chrome.tabs.create).toHaveBeenCalled();
        })
    
    });
})