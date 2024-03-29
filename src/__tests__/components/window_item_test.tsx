import { render, screen, within, fireEvent } from "@testing-library/react";

import '@testing-library/jest-dom';
import WindowItem from "../../components/features/window_item";
import { iTabItem } from "../../interfaces/tab_item";
import TabItem from "../../components/features/tab_item";
import { Provider } from "react-redux";
import { store } from "../../redux/reducers";

const mockId: number = 45;
const mockTabs: Array<iTabItem> = [];
const totalTabs = 20;

for(let i = 0; i < totalTabs; i++){
    mockTabs.push(
        {
            id: i,
            label: `Mock Tab ${i}`,
            url: "http://google.com",
            marked: i % 2 ? true : false
        }
    )
}

describe("Test <WindowItem>", () => {
    test("All tabs provided in props are visible", () => {
        render(
            <Provider store={store}>
                <WindowItem id={mockId} tabs={mockTabs} />
            </Provider>
        );
    
        const tabs = screen.getAllByTestId("tab-item");
        const editableTab = screen.queryByTestId("editable-tab");

        tabs.forEach((tab) => expect(tab).toBeInTheDocument())
        expect(tabs.length).toEqual(20);

        expect(editableTab).not.toBeInTheDocument();
    });

    test("Editable tab is visible if no tabs in props", () => {
        render(
            <Provider store={store}>
                <WindowItem id={mockId} tabs={[]} />
            </Provider>
        );
    
        const tab = screen.queryByTestId("tab-item");      
        expect(tab).not.toBeInTheDocument();

        const editableTab = screen.queryByTestId("editable-tab");
        expect(editableTab).toBeInTheDocument();
    });

    test("trash icon is visible when window is editable", () => {
        render(
            <Provider store={store}>
                <WindowItem id={mockId} tabs={mockTabs} disableEdit={false} />
            </Provider>
        );
        
        const trashButton = screen.queryByTestId("generic-icon-button-trash");
        expect(trashButton).toBeInTheDocument();
    })

    test("trash icon is hidden when window is not editable", () => {
        render(
            <Provider store={store}>
                <WindowItem id={mockId} tabs={mockTabs} disableEdit={true} />
            </Provider>
        );
        
        const trashButton = screen.queryByTestId("generic-icon-button-trash");
        expect(trashButton).not.toBeInTheDocument();
    })
});
