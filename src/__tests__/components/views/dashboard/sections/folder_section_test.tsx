import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider, useSelector } from "react-redux";
import FoldersSection from "../../../../../views/dashboard/sections/folders_section";
import mockStore from "../../../../../tools/testing/mock_store";
import mockBrowserStorage from "../../../../../tools/testing/mock_browser_storage";



describe("Test <FoldersSection>", () => {
    test("When invoked, fetch data from storage", () => {
        // @ts-expect-error
        chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
            callback(mockBrowserStorage)
        });

        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        )

        expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    test("No warning messages when newly rendered (all warning settings turned off)", () => {
        // @ts-expect-error
        chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
            callback({ 
                performanceWarningValue: -1,
                duplicationWarningValue: -1,
                showFolderChangeWarning: false,
                folderRemovalWarning: false
            })
        })

        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        )
        
        const warningMessages = screen.queryAllByRole("alert");
        expect(warningMessages.length).toEqual(0)
    })
})
