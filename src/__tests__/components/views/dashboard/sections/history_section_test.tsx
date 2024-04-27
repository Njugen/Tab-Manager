import { render, screen, within, fireEvent, waitFor, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider, useSelector } from "react-redux";
import FoldersSection from "../../../../../views/dashboard/sections/folders_section";
import mockStore, { mockFolders } from "../../../../../tools/testing/mock_store";
import mockBrowserStorage from "../../../../../tools/testing/mock_browser_storage";
import { get } from "http";
import { changeDuplicationWarningValue } from "../../../../../redux-toolkit/slices/plugin_settings_slice";
import randomNumber from "../../../../../tools/random_number";
import { act } from "react-dom/test-utils";
import { iFolderItem } from "../../../../../interfaces/folder_item";
import { iWindowItem } from "../../../../../interfaces/window_item";
import HistorySection from './../../../../../views/dashboard/sections/history_section';
import mockHistoryTabs from "../../../../../tools/testing/mock_history";

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
    cleanup();
})

// Number of tabs to mark
const markCount = 4;

describe("Test <HistorySection>", () => {
    test("All groups have tabs from browser history in them", () => {
        render(
            <Provider store={mockStore}>
                <HistorySection />
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
                <HistorySection />
            </Provider>
        )

        const tabs = screen.getAllByTestId("tab-item");
        expect(tabs.length).toEqual(mockHistoryTabs.length)
    })

    test("'Open selected' button is disabled when rendered", () => {
        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        const button = screen.getByText("Open selected", { selector: "button" });
        expect(button).toBeDisabled();
    })

    test("'Add to folder' button is disabled when rendered", () => {
        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        const button = screen.getByText("Add to folder", { selector: "button" });
        expect(button).toBeDisabled();
    })

    test("'Delete from history' button is disabled when rendered", () => {
        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        const button = screen.getByTestId("text-icon-button-trash");
        expect(button).toBeDisabled();
    })

    describe("Test marking and interaction with Folder Manager", () => {
        describe("Adding marked tabs to folder manager", () => {
            const addToFolderSequenceRender = () => {
                render(
                    <Provider store={mockStore}>
                        <HistorySection />
                    </Provider>
                )
    
                const tabs = screen.getAllByTestId("tab-item");
    
                for(let i = 0; i < markCount; i++){
                    const checkbox = within(tabs[i]).getByTestId("checkbox");
                    fireEvent.click(checkbox);
                }
    
                const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
                fireEvent.click(addToFolderButton);
            }
    
            test("Folder manager contains marked history tabs if user choose to add them to a new folder", () => {
                addToFolderSequenceRender();
    
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
                addToFolderSequenceRender();
    
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
        })

        describe("Test mark/unmark all tabs sequences", () => {
            const markUnmarkAllSequenceRender = () => {
                render(
                    <Provider store={mockStore}>
                        <HistorySection />
                    </Provider>
                )
    
                const markAllButton = screen.getByTestId("text-icon-button-deselected_checkbox");
                fireEvent.click(markAllButton); 
    
                const unMarkAllButton = screen.getByTestId("text-icon-button-selected_checkbox");
                fireEvent.click(unMarkAllButton); 
            }
            
    
            test("Clicking unmark all will leave no checkbox checked", () => {
                markUnmarkAllSequenceRender()
    
                const markCount = screen.queryAllByTestId("checked-icon").length;
    
                expect(markCount).toEqual(0);
            });
    
            test("Clicking unmark all will disable the 'Open selected' button", () => {
                markUnmarkAllSequenceRender()
    
                const button = screen.getByText("Open selected", { selector: "button" });
                expect(button).toBeDisabled();
            });
    
            test("Clicking unmark all will disable the 'Add to folder' button", () => {
                markUnmarkAllSequenceRender()
    
                const button = screen.getByText("Add to folder", { selector: "button" });
                expect(button).toBeDisabled();
            });
    
            test("Clicking unmark all will disable the 'Delete from history' button", () => {
                markUnmarkAllSequenceRender()
    
                const button = screen.getByTestId("text-icon-button-trash");
                expect(button).toBeDisabled();
            });
        })

        describe("Test mark/unmark single tab sequence", () => {
            const markUnmarkTabSequenceRender = () => {
                render(
                    <Provider store={mockStore}>
                        <HistorySection />
                    </Provider>
                )
    
                const tabs = screen.getAllByTestId("tab-item");
                let checkbox = within(tabs[0]).getByTestId("checkbox");
                fireEvent.click(checkbox);
    
                checkbox = within(tabs[0]).getByTestId("checkbox");
                fireEvent.click(checkbox); 
            }
    
            test("Clicking unmark a button will leave no checkbox checked", () => {
                markUnmarkTabSequenceRender();
    
                const markCount = screen.queryAllByTestId("checked-icon").length;
    
                expect(markCount).toEqual(0);
            });
    
            test("Mark and unmark a tab will disable the 'Open selected' button", () => {
                markUnmarkTabSequenceRender();
    
                const button = screen.getByText("Open selected", { selector: "button" });
                expect(button).toBeDisabled();
            });
    
            test("Mark and unmark a tab will disable the 'Add to folder' button", () => {
                markUnmarkTabSequenceRender();
    
                const button = screen.getByText("Add to folder", { selector: "button" });
                expect(button).toBeDisabled();
            });
    
            test("Mark and unmark a tab will disable the 'Delete from history' button", () => {
                markUnmarkTabSequenceRender();
    
                const button = screen.getByTestId("text-icon-button-trash");
                expect(button).toBeDisabled();
            });
        })

        test("Folder manager contains all tabs marked by the 'Mark all' feature", () => {
            render(
                <Provider store={mockStore}>
                    <HistorySection />
                </Provider>
            )

            const markAllButton = screen.getByTestId("text-icon-button-deselected_checkbox");
            fireEvent.click(markAllButton); 

            const marks = screen.getAllByTestId("checked-icon");
            const marksCount = marks.length;

            const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
            fireEvent.click(addToFolderButton)

            // Open dialog, where user selects how he wants to add the tabs
            let dialog = screen.getByRole("dialog");
            const newFolderButton = within(dialog).getByText("To a new folder", { selector: "button" });

            fireEvent.click(newFolderButton);
            
            // Folder manager
            dialog = screen.getByRole("dialog");

            // Number of rendered tabs in folder manager should equal the numbers marked
            const renderedTabs = within(dialog).getAllByTestId("tab-item");

            expect(marksCount).toEqual(renderedTabs.length);
            const cancelButton = within(dialog).getByText("Cancel", { selector: "button" });

            fireEvent.click(cancelButton, { bubbles: true });
            act(() => {
                jest.runAllTimers();
            });
        });

        test("Folder manager contains all tabs marked by the 'Mark all' feature + existing folder tabs", () => {
            render(
                <Provider store={mockStore}>
                    <HistorySection />
                </Provider>
            )

            const markAllButton = screen.getByTestId("text-icon-button-deselected_checkbox");
            fireEvent.click(markAllButton); 

            const markCount = screen.getAllByTestId("checked-icon").length;

            const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
            fireEvent.click(addToFolderButton);

            // Open dialog, where user selects how he wants to add the tabs
            let dialog = screen.getByRole("dialog");

            
            const dropdown = screen.getByText("Select a folder", { selector: "button" });
            fireEvent.click(dropdown);

            const options = screen.getAllByRole("listitem")
            const targetOptionButton = within(options[1]).getByRole("button");
            fireEvent.click(targetOptionButton);
            
            // Folder manager
            dialog = screen.getByRole("dialog");

            let totalFolderMockTabs = 0;
            mockFolders[0].windows.forEach((window) => {
                totalFolderMockTabs += window.tabs.length;
            })

            // Number of rendered tabs in folder manager should equal the numbers marked
            const renderedTabs = within(dialog).getAllByTestId("tab-item");

            expect(markCount + totalFolderMockTabs).toEqual(renderedTabs.length);
            const cancelButton = within(dialog).getByText("Cancel", { selector: "button" });

            fireEvent.click(cancelButton, { bubbles: true });
            act(() => {
                jest.runAllTimers();
            });
        });
    });

    describe("Test history lazy load", () => {
        test("Scrolling will add even more tabs while in fullscreen", () => {
            // @ts-expect-error
            chrome.history.search = jest.fn((query, callback: (e: any) => {}): void => {
                const count = query.maxResults || 0;
                const tabsSelection = []
    
                for(let i = 0; i < count; i++){
                    tabsSelection.push(mockHistoryTabs[i])
                }
    
                callback([...tabsSelection])
            })
    
            render(
                <Provider store={mockStore}>
                    <HistorySection />
                </Provider>
            )
    
            const initTabs = screen.getAllByTestId("tab-item");
            const initTabsCount = initTabs.length;
    
            const fullscreenButton = screen.getByTestId("fullscreen-icon");
            fireEvent.click(fullscreenButton, { bubbles: true })
    
            fireEvent.scroll(window, { scrollY: 2000 })
    
            const currentTabs = screen.getAllByTestId("tab-item");
            const currentTabsCount = currentTabs.length;
    
            expect(currentTabsCount).toBeGreaterThan(initTabsCount)
        });

        test("Scrolling will not add more tabs while not in fullscreen", () => {
            // @ts-expect-error
            chrome.history.search = jest.fn((query, callback: (e: any) => {}): void => {
                const count = query.maxResults || 0;
                const tabsSelection = []
    
                for(let i = 0; i < count; i++){
                    tabsSelection.push(mockHistoryTabs[i])
                }
    
                callback([...tabsSelection])
            })
    
            render(
                <Provider store={mockStore}>
                    <HistorySection />
                </Provider>
            )
    
            const initTabs = screen.getAllByTestId("tab-item");
            const initTabsCount = initTabs.length;
    
            fireEvent.scroll(window, { scrollY: 2000 })
    
            const currentTabs = screen.getAllByTestId("tab-item");
            const currentTabsCount = currentTabs.length;
    
            expect(currentTabsCount).toEqual(initTabsCount)
        });
    })

    test("Delete tabs feature triggers relevant Browser's API", () => {
        chrome.history.deleteUrl = jest.fn();

        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        const markAllButton = screen.getByTestId("text-icon-button-deselected_checkbox");
        fireEvent.click(markAllButton); 

        const button = screen.getByTestId("text-icon-button-trash");
        fireEvent.click(button);

        expect(chrome.history.deleteUrl).toHaveBeenCalled();
    })

    test("Open tabs feature triggers relevant Browser's API", () => {
        chrome.tabs.create = jest.fn();

        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        const markAllButton = screen.getByTestId("text-icon-button-deselected_checkbox");
        fireEvent.click(markAllButton); 

        const button = screen.getByText("Open selected", { selector: "button" });
        fireEvent.click(button);

        expect(chrome.tabs.create).toHaveBeenCalled();
    })

    test("Toggling list->grid saves the decision to browser storage", () => {
        // @ts-expect-error
        chrome.storage.local.set = jest.fn((data: any) => {});

        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        const button = screen.getByTestId("text-icon-button-grid");
        fireEvent.click(button);

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ "history_viewmode": "grid" });
    })

    test("Toggling grid->list saves the decision to browser storage", () => {
        // @ts-expect-error
        chrome.storage.local.set = jest.fn((data: any) => {});

        render(
            <Provider store={mockStore}>
                <HistorySection />
            </Provider>
        )

        let button = screen.getByTestId("text-icon-button-grid");
        fireEvent.click(button);

        button = screen.getByTestId("text-icon-button-list");
        fireEvent.click(button);

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ "history_viewmode": "list" });
    })
})
