import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Checkbox from "../../../components/utils/checkbox";

const mockCallback = jest.fn();

describe("Test <Checkbox />", () => {
    test("Can be checked", () => {
        render(<Checkbox checked={false} onCallback={mockCallback} />);

        // Button exists
        let button = screen.getByRole("button");
  
        fireEvent.click(button);
        let icon = within(button).queryByRole("img");
        expect(icon).toBeInTheDocument();
    })

    test("Can be unchecked", () => {
        render(<Checkbox checked={true} onCallback={mockCallback} />);

        // Button exists
        let button = screen.getByRole("button");
        
        fireEvent.click(button);
        let icon = within(button).queryByRole("img");

        expect(icon).not.toBeInTheDocument();
    })

    test("can be checked -> unchecked -> checked", () => {
        render(<Checkbox checked={true} onCallback={mockCallback} />);
        
        // Button exists
        let button = screen.getByRole("button");
        fireEvent.click(button);
        fireEvent.click(button);
        
        let icon = within(button).queryByRole("img");
        expect(icon).toBeInTheDocument();
    })

    test("can be unchecked -> checked -> unchecked", () => {
        render(<Checkbox checked={false} onCallback={mockCallback} />);
        
        // Button exists
        let button = screen.getByRole("button");
        fireEvent.click(button);
        fireEvent.click(button);
        
        let icon = within(button).queryByRole("img");
        expect(icon).not.toBeInTheDocument();
    })
})