import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import Group from "../../../components/utils/group";
import DropdownMenu from "../../../components/utils/dropdown_menu/dropdown_menu";
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

describe("Test <DropdownMenu>", () => {
    test("Renders ok, each option triggers callback when clicked", () => {
        render(<DropdownMenu tag={mockTag} options={mockOptions} onSelect={mockCallback} selected={null} />);

        const menu = screen.getByRole("list");
        
        mockOptions.forEach((option) => {
            const item = within(menu).getByText(option.label, { selector: "button" });
            expect(item).toBeInTheDocument();
            fireEvent.click(item);

            expect(mockCallback).toHaveBeenCalledWith(option.id);
        })
    })

    test("Renders and works ok with preset", () => {
        render(<DropdownMenu tag={mockTag} options={mockOptions} onSelect={mockCallback} selected={mockOptions[0].id} />);

        const menu = screen.getByRole("list");
        
        mockOptions.forEach((option) => {
            const item = within(menu).getByText(option.label, { selector: "button" });
            expect(item).toBeInTheDocument();
            fireEvent.click(item);

            expect(mockCallback).toHaveBeenCalledWith(option.id);
        })
    })
});