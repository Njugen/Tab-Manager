import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import GenericButton from "../../../components/utils/generic_button";
import iAddToFolderPopup from "../../../interfaces/add_to_folder_popup";
import randomNumber from './../../../tools/random_number';
import AddToFolderPopup from "../../../components/features/add_to_folder_popup";

const mockProps: iAddToFolderPopup = {
    title: randomNumber().toString(),
    type: "slide-in",
    dropdownOptions: [
        {
            id: randomNumber(),
            label: randomNumber().toString()
        },
        {
            id: randomNumber(),
            label: randomNumber().toString()
        },
        {
            id: randomNumber(),
            label: randomNumber().toString()
        }
    ],
    onNewFolder: jest.fn((): void => {}),
    onExistingFolder: jest.fn((e: any): void => {}),
    onCancel: jest.fn((): void => {}),
}

describe("Test <AddToFolderPopup>", () => {
    test("Triggers onNewFolder when 'To a new folder' button is clicked", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const addToNewFolderButton = screen.getByText("To a new folder");
        fireEvent.click(addToNewFolderButton);

        expect(mockProps.onNewFolder).toHaveBeenCalled();
    })

    test("Triggers onCancel when 'To a new folder' button is clicked", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const addToNewFolderButton = screen.getByText("To a new folder");
        fireEvent.click(addToNewFolderButton);

        expect(mockProps.onCancel).toHaveBeenCalled();
    })

    test("Triggers onCancel when 'X' button is clicked", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const xButton = screen.getByTestId("close-icon");
        fireEvent.click(xButton);

        expect(mockProps.onCancel).toHaveBeenCalled();
    });

    test("triggers onExistingFolder when selecting an existing folder", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const dropdown = screen.getByRole("menu");
        let selectedLabel = within(dropdown).getByText(mockProps.dropdownOptions[0].label);
        fireEvent.click(selectedLabel);


        let menu = within(dropdown).getByRole("list");
        let options = within(menu).getAllByRole("listitem");
        let targetButton = within(options[1]).getByRole("button");
        fireEvent.click(targetButton);

        expect(mockProps.onExistingFolder).toHaveBeenCalledWith({ selected: mockProps.dropdownOptions[1].id });
    })

    test("triggers onCancel when selecting an existing folder", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const dropdown = screen.getByRole("menu");
        let selectedLabel = within(dropdown).getByText(mockProps.dropdownOptions[0].label);
        fireEvent.click(selectedLabel);


        let menu = within(dropdown).getByRole("list");
        let options = within(menu).getAllByRole("listitem");
        let targetButton = within(options[1]).getByRole("button");
        fireEvent.click(targetButton);

        expect(mockProps.onCancel).toHaveBeenCalled()
    })

    test("Title is in place", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const title = screen.getByText(mockProps.title);
        expect(title).toBeInTheDocument();
    })
});