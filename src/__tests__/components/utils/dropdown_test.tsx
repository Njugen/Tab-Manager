import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Dropdown from "../../../components/utils/dropdown/dropdown";
import { iFieldOption, iDropdownSelected } from "../../../interfaces/dropdown";
import randomNumber from "../../../tools/random_number";

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
const mockTag = randomNumber().toString();

const mockFunction = jest.fn((data: iDropdownSelected) => data);

describe("test of <Dropdown /> behaviour", () => {
    test.each(mockOptions)("presets, options and callback works", (arg) => {
        render(<Dropdown tag={mockTag} preset={arg} options={mockOptions} onCallback={mockFunction} />);

        // dropdown options not visible per default
        let optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        // click anywhere
        fireEvent.click(document.body);

        // dropdown list still not visible
        optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        let dropdown = screen.getByTestId(`${mockTag}-selector`);
        
        // The preset text matches mockOptions[0].label
        let presetText = within(dropdown).getByText(arg.label);
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

         let option = screen.getByText(arg.label, { selector: "button" });
        fireEvent.click(option);

        // Dropdown list is no longer visible, and
        optionList = screen.queryByRole("list");
        expect(optionList).not.toBeInTheDocument();

        // mockOnExistingFolder is called
        expect(mockFunction).toHaveBeenCalledWith({ selected: arg.id });

        // The dropdown now shows arg.label as its selected text
        dropdown = screen.getByTestId(`${mockTag}-selector`);
        within(dropdown).getByText(arg.label);

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

        // mockFunction is called
        expect(mockFunction).toHaveBeenCalledWith({ selected: arg.id });
    });
});