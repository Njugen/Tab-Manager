import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import Dropdown from "../../../components/utils/dropdown/dropdown";
import { iFieldOption } from "../../../interfaces/dropdown";

const mockPreset: iFieldOption = {
    id: randomNumber(),
    label: randomNumber().toString()
}

const mockOptions: Array<iFieldOption> = [];
const mockCallback = jest.fn((e: any) => e);
const mockTag = randomNumber().toString()

for(let i = 0; i < 5; i++){
    mockOptions.push(
        {
            id: randomNumber(),
            label: randomNumber().toString()
        }
    )
}

describe("Test <Dropdown />", () => {
    test("Initial render ok, dropdown list in place and reacts to user interaction", () => {
        render(
            <Dropdown tag={mockTag} preset={mockPreset} options={mockOptions} onCallback={mockCallback}  />
        );

        const dropdown = screen.getByRole("menu");
        let optionsList = within(dropdown).queryByRole("list");

        expect(optionsList).not.toBeInTheDocument();

        // Check the dropdown feature itself
        let selectedLabel = within(dropdown).getByText(mockPreset.label);
        expect(selectedLabel).toBeInTheDocument();

        // Make an initial click on the dropdown
        fireEvent.click(selectedLabel);

        // Now, check that the menu is visible, all mock options are visible. Loop through each
        // of the options and click them. The component should react accordingly
        mockOptions.forEach((option) => {

            // List is visible
            optionsList = within(dropdown).getByRole("list");
            expect(optionsList).toBeInTheDocument();
            
            // This mock option is in the list
            const target = within(optionsList).getByText(option.label, { selector: "button" });
            expect(target).toBeVisible();

            // Click this mock option.
            fireEvent.click(target);
            optionsList = within(dropdown).queryByRole("list");
            expect(optionsList).not.toBeInTheDocument();

            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    selected: option.id
                })
            );

            // Prepare for next loop
            selectedLabel = within(dropdown).getByText(option.label);
            expect(selectedLabel).toBeInTheDocument();
    
            fireEvent.click(selectedLabel);
        })
        
        optionsList = within(dropdown).getByRole("list");
        expect(optionsList).toBeInTheDocument();

        // Clicking outside the dropdown will hide its menu
        fireEvent.click(window);
        optionsList = within(dropdown).queryByRole("list");
        expect(optionsList).not.toBeInTheDocument()
     
    })
        
    
})