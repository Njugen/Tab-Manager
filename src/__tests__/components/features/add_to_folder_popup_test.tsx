import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import iAddToFolderPopup from "../../../interfaces/add_to_folder_popup";
import randomNumber from './../../../tools/random_number';
import AddToFolderPopup from "../../../components/features/add_to_folder_popup";

const mockProps: iAddToFolderPopup = {
    title: randomNumber().toString(),
    type: "slide-in",
    dropdownOptions: [
        {
            value: randomNumber(),
            label: randomNumber().toString()
        },
        {
            value: randomNumber(),
            label: randomNumber().toString()
        },
        {
            value: randomNumber(),
            label: randomNumber().toString()
        }
    ],
    onNewFolder: jest.fn((): void => {}),
    onExistingFolder: jest.fn((e: any): void => {}),
    onCancel: jest.fn((): void => {}),
}

afterEach(() => cleanup())

describe("Test <AddToFolderPopup>", () => {
    const { onNewFolder, onCancel, onExistingFolder, dropdownOptions } = mockProps;

    describe("Test 'To a new folder' button", () => {
        test.each([
            ["onNewFolder", onNewFolder],
            ["onCancel", onCancel]
        ])("%j props triggers when button is clicked", (label: string, prop: any) => {
            render(
                <AddToFolderPopup {...mockProps} />
            );

            const addToNewFolderButton = screen.getByText("To a new folder");
            fireEvent.click(addToNewFolderButton);

            expect(prop).toHaveBeenCalled();
        })
    })

    describe("Test folder selection", () => {
        const common = () => {
            render(
                <AddToFolderPopup {...mockProps} />
            );
            
            const dropdown = screen.getByRole("menu");
            let selectedLabel = within(dropdown).getByText(dropdownOptions[0].label);
            fireEvent.click(selectedLabel);
    
            let menu = within(dropdown).getByRole("list");
            let options = within(menu).getAllByRole("listitem");
            let targetButton = within(options[1]).getByRole("button");
            fireEvent.click(targetButton);
        }

        test("triggers 'onExistingFolder' prop when selecting an existing folder", () => {
            common();
            expect(onExistingFolder).toHaveBeenCalledWith({ selected: dropdownOptions[1].value });
        })
    
        test("triggers' onCancel' prop when selecting an existing folder", () => {
            common()
            expect(onCancel).toHaveBeenCalled()
        })

    })

    test("Triggers 'onCancel' prop when 'X' button is clicked", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const xButton = screen.getByTestId("close-icon");
        fireEvent.click(xButton);

        expect(onCancel).toHaveBeenCalled();
    });

    test("'title' prop is visible in the component", () => {
        render(
            <AddToFolderPopup {...mockProps} />
        );

        const title = screen.getByText(mockProps.title);
        expect(title).toBeInTheDocument();
    })
});