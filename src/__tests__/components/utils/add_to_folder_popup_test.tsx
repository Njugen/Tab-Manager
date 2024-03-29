import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

import AddToFolderPopup from "../../../components/features/add_to_folder_popup";
import { iFieldOption } from "../../../interfaces/dropdown";
import randomNumber from "../../../tools/random_number";

const mockOnNewWorkspace = jest.fn();
const mockOnExistingWorkspace = jest.fn((data: any) => data);
const mockOnCancel = jest.fn();

const mockOptions: Array<iFieldOption> = [
    {
        id: 0,
        label: "George Washington",
    },
    {
        id: 1,
        label: "Abraham Lincoln"
    },
    {
        id: 2,
        label: "Barack Obama"
    }
];
const mockNoOptions: Array<iFieldOption> = [];

describe("extensive test of <AddToFolderPopup /> behaviour", () => {
    test("All props in place. Dropdown not visible if there are no options", () => {
        const mockTitle: string = randomNumber().toString();

        render(
            <AddToFolderPopup 
                title={mockTitle}
                type="slide-in" 
                dropdownOptions={mockNoOptions}
                onNewWorkspace={mockOnNewWorkspace}
                onExistingWorkspace={mockOnExistingWorkspace}
                onCancel={mockOnCancel}
            />
        );

        expect(document.body.style.overflowY).toBe("hidden");

        let titleText = screen.getByText(mockTitle);
        expect(titleText).toBeInTheDocument();

        // Test add new folder button again
        let newWorkSpaceButton = screen.getByText("To a new folder", { selector: "button" });
        expect(newWorkSpaceButton).toBeInTheDocument();

        fireEvent.click(newWorkSpaceButton);
        expect(mockOnNewWorkspace).toHaveBeenCalled();

        // Click cancel
        const closeButton = screen.getByTestId("generic-icon-button-close");
        expect(closeButton).toBeInTheDocument();
        
        fireEvent.click(closeButton);
        expect(document.body.style.overflowY).toBe("auto");
        expect(mockOnCancel).toHaveBeenCalled();
    });
    
    test.each(mockOptions)("title, dropdown and all callbacks are visible and working for all options", (arg) => {
        const mockTitle = randomNumber().toString();

        render(
            <AddToFolderPopup 
                title={mockTitle} 
                type="slide-in" 
                dropdownOptions={mockOptions}
                onNewWorkspace={mockOnNewWorkspace}
                onExistingWorkspace={mockOnExistingWorkspace}
                onCancel={mockOnCancel}
            />
        );

        const { overflowY } = document.body.style;
        
        expect(overflowY).toBe("hidden");
        
        let titleText = screen.getByText(mockTitle);
        expect(titleText).toBeInTheDocument();

        // Add new folder button
        let newWorkSpaceButton = screen.getByText("To a new folder", { selector: "button" });
        expect(newWorkSpaceButton).toBeInTheDocument();

        fireEvent.click(newWorkSpaceButton);
        expect(mockOnNewWorkspace).toHaveBeenCalled();

        // dropdown options not visible per default
        let optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        // click anywhere
        fireEvent.click(document.body);

        // dropdown list still not visible
        optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        let dropdown = screen.getByTestId("select-folder-dropdown-selector");
        
        // The preset text matches mockOptions[0].label
        let presetText = within(dropdown).getByText(mockOptions[0].label);
        expect(presetText).toBeInTheDocument();

        // click the dropdown
        fireEvent.click(dropdown);

        // dropdown list now visible
        optionList = screen.queryByRole("list");
        expect(optionList).toBeInTheDocument();

        // Click outside the dropdown list. 
        fireEvent.click(document.body);

        // dropdown list now not visible
        optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        // Click the dropdown again
        fireEvent.click(dropdown);

        // dropdown list now visible
        optionList = screen.queryByRole("list");
        expect(optionList).toBeInTheDocument();

        // Click an option
        let option = screen.getByText(arg.label, { selector: "button" });
        fireEvent.click(option);

        // Dropdown list is no longer visible, and
        optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        // mockOnExistingWorkspace is called
        expect(mockOnExistingWorkspace).toHaveBeenCalledWith({ selected: arg.id });

        // The dropdown now shows arg.label as its selected text
        dropdown = screen.getByTestId("select-folder-dropdown-selector");
        expect(dropdown).toHaveTextContent(arg.label);

        // Click the dropdown again
        fireEvent.click(dropdown);

        // dropdown list now visible
        optionList = screen.queryByRole("list");
        expect(optionList).toBeInTheDocument();

        // Click an option
        option = screen.getByText(arg.label, { selector: "button" });
        fireEvent.click(option);

        // Dropdown list is no longer visible, and
        optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        // mockOnExistingWorkspace is called
        expect(mockOnExistingWorkspace).toHaveBeenCalledWith({ selected: arg.id });
        
        // Test add new folder button again
        newWorkSpaceButton = screen.getByText("To a new folder", { selector: "button" });
        expect(newWorkSpaceButton).toBeInTheDocument();

        fireEvent.click(newWorkSpaceButton);
        expect(mockOnNewWorkspace).toHaveBeenCalled();

        // Click Close Button
        const closeButton = screen.getByTestId("generic-icon-button-close");
        expect(closeButton).toBeInTheDocument();
        
        fireEvent.click(closeButton);
        expect(document.body.style.overflowY).toBe("auto");
        expect(mockOnCancel).toHaveBeenCalled();
    });
});