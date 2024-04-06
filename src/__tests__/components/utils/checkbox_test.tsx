import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Checkbox from "../../../components/utils/checkbox";

const mockCallback = jest.fn();

describe("Test <Checkbox />", () => {
    test("Clicking checkbox off/on works", () => {
        render(<Checkbox checked={false} onCallback={mockCallback} />);
        
        // Button exists
        let button = screen.getByRole("button");
        let icon = within(button).queryByRole("img");

        expect(icon).not.toBeInTheDocument();
        
        fireEvent.click(button);
        expect(mockCallback).toHaveBeenCalled();
        icon = within(button).getByRole("img");
        
        expect(icon).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockCallback).toHaveBeenCalled();
        icon = within(button).queryByRole("img");
        expect(icon).not.toBeInTheDocument();
    })
    
    test("Clicking checkbox on/off works", () => {
        render(<Checkbox checked={true} onCallback={mockCallback} />);
        
        // Button exists
        let button = screen.getByRole("button");
        let icon = within(button).queryByRole("img");

        expect(icon).toBeInTheDocument();
        
        fireEvent.click(button);
        expect(mockCallback).toHaveBeenCalled();
        icon = within(button).queryByRole("img");
        
        expect(icon).not.toBeInTheDocument();

        fireEvent.click(button);
        expect(mockCallback).toHaveBeenCalled();
        icon = within(button).getByRole("img");
        expect(icon).toBeInTheDocument();
    })
})