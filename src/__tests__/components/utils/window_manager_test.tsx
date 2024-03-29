import { fireEvent, render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom'

import { Provider} from "react-redux";
import { iFolderItem } from "../../../interfaces/folder_item";
import FolderItem from "../../../components/features/folder_item/folder_item";
import { createStore, applyMiddleware } from "redux";
import WindowManager from "../../../components/features/window_manager/window_manager";
import thunk from "redux-thunk";
import { combinedReducers, mockStore } from "../../../redux/reducers";
import { createFolderAction } from "../../../redux/actions/folder_collection_actions";
import { store } from "../../../redux/reducers";
import { useDispatch, useSelector } from "../../../redux/mocked_hooks"; 
import { initInEditFolder } from "../../../redux/actions/in_edit_folder_actions";

jest.mock("../../../redux/mocked_hooks");
jest.setTimeout(10000);
jest.useFakeTimers();

const mockFolder: iFolderItem = {
    id: 1,
    name: "Dragonball Z",
    desc: "This is a folder with links to Dragonball related pages",
    marked: false,
    type: "expanded",
    viewMode: "list",
    windows: [
        {
            id: 1,
            tabs: [{
                id: 1,
                label: "test tab",
                url: "http://localhost:3000",
                marked: false
            },
            {
                id: 4,
                label: "test tab",
                url: "http://localhost:3000",
                marked: false
            }]
        },
        {
            id: 2,
            tabs: [{
                id: 1,
                label: "test tab",
                url: "http://google.com",
                marked: false
            },
            {
                id: 6,
                label: "test tab",
                url: "http://localhost:3000",
                marked: false
            }]
        },
        {
            id: 3,
            tabs: [{
                id: 1,
                label: "test tab",
                url: "http://fz.se",
                marked: false
            }]
        }
    ]
};

const mockFolderNoWindows: iFolderItem = {
    id: 1,
    name: "Dragonball Z",
    desc: "This is a folder with links to Dragonball related pages",
    marked: false,
    type: "expanded",
    viewMode: "list",
    windows: []
};

beforeEach(() => {
    //const state = mockStore();
    useSelector.mockImplementation(() => store.getState());
    useDispatch.mockClear();
    useDispatch.mockImplementation(() => store.dispatch);
})

afterEach(() => {
   jest.clearAllMocks();
});


describe("test <WindowManager>", () => {
    
    
    test("No windows in folder -> window manager has no windows", async () => {
        store.dispatch(initInEditFolder(mockFolderNoWindows));

        render(
            <Provider store={store}>
                <WindowManager />
            </Provider>
        );

        const windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(0);
        
    });

    
    test("Windows exists in redux store -> windows are listed and can be removed", async () => {
        store.dispatch(initInEditFolder(mockFolder));  

        render(
            <Provider store={store}>
                <WindowManager />
            </Provider>
        );

        let windowItems = screen.queryAllByTestId("window-item");
        
        expect(windowItems.length).toEqual(mockFolder.windows.length);

        //Now check wether or not a window disappears when trash icon is clicked
        const trashButtons = screen.queryAllByTestId("generic-icon-button-trash");
        fireEvent.click(trashButtons[0]);

        windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(mockFolder.windows.length-1);
    })

    test("a window can be removed when clicking its trash button", async () => {
        store.dispatch(initInEditFolder(mockFolder));  

        render(
            <Provider store={store}>
                <WindowManager />
            </Provider>
        );


        const trashButtons = screen.queryAllByTestId("generic-icon-button-trash");
        fireEvent.click(trashButtons[0]);

        let windowItems = screen.queryAllByTestId("window-item");
        expect(windowItems.length).toEqual(mockFolder.windows.length-1);
    })
});