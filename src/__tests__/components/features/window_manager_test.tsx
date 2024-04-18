import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import GenericButton from "../../../components/utils/generic_button";
import WindowManager from "../../../components/features/window_manager/window_manager";
import { Provider, useSelector } from "react-redux";
import { store } from "../../../redux-toolkit/store";


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
});