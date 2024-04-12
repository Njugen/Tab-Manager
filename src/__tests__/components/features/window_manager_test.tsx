import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import GenericButton from "../../../components/utils/generic_button";
import WindowManager from "../../../components/features/window_manager/window_manager";
import { Provider, useSelector } from "react-redux";
import { store } from "../../../redux/reducers";
import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { folderManagerReducer } from "../../../redux/reducers/in_edit_folder_reducer";

describe("Test <WindowManager>", () => {
    test("No window lists at invokation", () => {
        render(
            <Provider store={store}>
                <WindowManager />
            </Provider>
        );

        let windowList = screen.queryAllByRole("list");
        expect(windowList.length).toEqual(0)
    })
    
    test("Clicking create window button renders a window with textfield (editable tab)", () => {
        render(
            <Provider store={store}>
                <WindowManager />
            </Provider>
        );
        const createWindowButton = screen.getByRole("button");
        fireEvent.click(createWindowButton);

        const windowList = screen.getAllByRole("list");
        let tabList = within(windowList[0]).getAllByRole("listitem");

        let textfield = within(tabList[0]).getByRole("textbox");

        expect(textfield).toBeInTheDocument();
    })

    test("There are windows when invoked with preset redux state", () => {
        const combinedReducers = combineReducers({
            folderManagerReducer: folderManagerReducer,
        });
        const middleware = applyMiddleware(thunk);
        const store = createStore(combinedReducers, middleware);
        store.subscribe(()=>{});
        const mockStore = {

        }
    })
});