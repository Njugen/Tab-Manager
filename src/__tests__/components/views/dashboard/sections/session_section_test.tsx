import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import SessionSection from "../../../../../views/dashboard/sections/session_section";
import mockStore, { mockStoreNoFolders } from "../../../../../tools/testing/mock_store";
import { Provider } from "react-redux";
import mockBrowserStorage from "../../../../../tools/testing/mock_browser_storage";
import mockWindows from './../../../../../tools/testing/mock_windows';
import { act } from "react-dom/test-utils";

beforeEach(() => {
    jest.useFakeTimers();
})

afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
})

describe("Test <SessionSection>", () => {
    test("There are no warnin/alerts when rendered", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback([mockWindows[0]])
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );
        const alert = screen.queryByRole("alert");
        expect(alert).not.toBeInTheDocument();
    });

    test("There are at least one window listed if those exist in browser storage", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.getAllByTestId("window-item");

        expect(windows.length).toBeGreaterThanOrEqual(1);
    })

    test("Each window has at least one tab", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.getAllByTestId("window-item");

        windows.forEach((window) => {
            const tabs = within(window).getAllByTestId("tab-item");
            expect(tabs.length).toBeGreaterThanOrEqual(1);
        })
    })

    test("There are no windows listed if there are none in browser storage", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback([])
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.queryAllByTestId("window-item");

        expect(windows.length).toEqual(0);
    });

    test("Attempt at removing a window does not trigger warnings", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.getAllByTestId("window-item");
        const firstWindow = windows[0];

        const trashIcon = within(firstWindow).getByTestId("trash-icon");
        fireEvent.click(trashIcon, { bubbles: true });
        
        const alert = screen.queryByRole("alert");
        expect(alert).not.toBeInTheDocument();
    })

    test("Attempt at removing the only listed window triggers a warning", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback([mockWindows[0]])
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.getAllByTestId("window-item");
        const firstWindow = windows[0];

        const trashIcon = within(firstWindow).getByTestId("trash-icon");
        fireEvent.click(trashIcon, { bubbles: true });
        
        const alert = screen.queryByRole("alert");
        expect(alert).toBeInTheDocument();
    })

    test("Clicking cancel in the warning message will close it", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback([mockWindows[0]])
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.getAllByTestId("window-item");
        const firstWindow = windows[0];

        const trashIcon = within(firstWindow).getByTestId("trash-icon");
        fireEvent.click(trashIcon, { bubbles: true });
        
        const alert = screen.getByRole("alert");
        const cancelButton = within(alert).getByTestId("alert-cancel-button");

        fireEvent.click(cancelButton);
        expect(alert).not.toBeInTheDocument();
    })

    test("Clicking cancel in the warning message will trigger browser api that closes browser", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback([mockWindows[0]])
        })
        // @ts-expect-error
        chrome.windows.remove = jest.fn((windowId: number): void => {});

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const windows = screen.getAllByTestId("window-item");
        const firstWindow = windows[0];

        const trashIcon = within(firstWindow).getByTestId("trash-icon");
        fireEvent.click(trashIcon, { bubbles: true });
        
        const alert = screen.getByRole("alert");
        const proceedButton = within(alert).getByTestId("alert-proceed-button");

        fireEvent.click(proceedButton);
        expect(chrome.windows.remove).toHaveBeenCalled();
    })

    test("Folder Manager contains session windows/tabs if user choose to add session to a new folder", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
        fireEvent.click(addToFolderButton, { bubbles: true });

        let dialog = screen.getByRole("dialog");
        const newFolderButton = within(dialog).getByText("To a new folder", { selector: "button" });

        fireEvent.click(newFolderButton, { bubbles: true });
        dialog = screen.getByRole("dialog");

        const visibleTabs = within(dialog).getAllByTestId("tab-item");

        const visibleTabsCount = visibleTabs.length;

        let mockTabsCount = 0;
        mockWindows.forEach((mockWindow: any) => {
            mockTabsCount += mockWindow.tabs.length;
        });

        expect(visibleTabsCount).toEqual(mockTabsCount);
    })

    test("Folder Manager closes when clicking its cancellation button", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })
        // @ts-expect-error
        chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
            callback({ ...mockBrowserStorage, showFolderChangeWarning: false })
        })

        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
        fireEvent.click(addToFolderButton, { bubbles: true });

        let dialog: any = screen.getByRole("dialog");
        const newFolderButton = within(dialog).getByText("To a new folder", { selector: "button" });

        fireEvent.click(newFolderButton, { bubbles: true });
        dialog = screen.getByRole("dialog");

        const cancelButton = within(dialog).getByText("Cancel", { selector: "button" });
        fireEvent.click(cancelButton, { bubbles: true });
        act(() => {
            jest.runAllTimers();
        });

        dialog = screen.queryByRole("dialog");
        expect(dialog).not.toBeInTheDocument();
    })

    test("Folder Manager contains additional windows when adding to an existing folder", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })
        // @ts-expect-error
        chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
            callback({ showFolderChangeWarning: false })
        })


        render(
            <Provider store={mockStore}>
                <SessionSection />
            </Provider>
        );

        const sessionWindows = screen.getAllByTestId("window-item");
        const sessionWindowsCount = sessionWindows.length;

        const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
        fireEvent.click(addToFolderButton, { bubbles: true });

        let dialog = screen.getByRole("dialog");
        const dropdown = within(dialog).getByText("Select a folder", { selector: "button" })
        fireEvent.click(dropdown);

        const dropdownList = within(dialog).getByRole("list");
        const options = within(dropdownList).getAllByRole("listitem");
        const targetOption = options[1];
        const targetButton = within(targetOption).getByRole("button");
        fireEvent.click(targetButton);
        dialog = screen.getByRole("dialog");
  

        const windowsInDialog = within(dialog).getAllByTestId("window-item");
        
        expect(windowsInDialog.length).toBeGreaterThan(sessionWindowsCount);
    })

    test("Folder Manager shows up immediately when adding windows/tabs, if no other folders exists in the plugin", () => {
        // @ts-expect-error
        chrome.windows.getAll = jest.fn((query, callback: (e: any) => {}): void => {
            callback(mockWindows)
        })

        render(
            <Provider store={mockStoreNoFolders}>
                <SessionSection />
            </Provider>
        );

        const addToFolderButton = screen.getByText("Add to folder", { selector: "button" });
        fireEvent.click(addToFolderButton, { bubbles: true });

        let dialog = screen.getByRole("dialog");

        const visibleTabs = within(dialog).getAllByTestId("tab-item");

        const visibleTabsCount = visibleTabs.length;

        let mockTabsCount = 0;
        mockWindows.forEach((mockWindow: any) => {
            mockTabsCount += mockWindow.tabs.length;
        });

        expect(visibleTabsCount).toEqual(mockTabsCount);
    })
})