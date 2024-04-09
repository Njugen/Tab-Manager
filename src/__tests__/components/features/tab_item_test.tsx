import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import TabItem from "../../../components/features/tab_item";

const mockProps = {
    id: randomNumber(),
    label: randomNumber().toString(),
    url: `https://${randomNumber()}.com`,
}

const mockMarkFn = jest.fn((tabId: number, checked: boolean): void | undefined => {});
const mockEditFn = jest.fn((tabId: number): void | undefined => {});
const mockOnCloseFn = jest.fn((tabId: number): any | undefined => {})

describe("Test <TabItem>", () => {
    test("Basic tab (no callbacks) renders ok", () => {
        render(
            <TabItem {...mockProps} />
        );

        const tab = screen.getByRole("listitem");
        const link = within(tab).getByRole("link");
        const favicon = within(tab).getByRole("img");

        expect(tab).toBeInTheDocument();
        expect(link).toBeVisible()
        expect(link).toHaveTextContent(mockProps.label);
        expect(favicon).toBeVisible();
    })

    test("Callbacks always trigger accordingly to relevant feature interactions", () => {
        render(
            <TabItem {...mockProps} onMark={mockMarkFn} onEdit={mockEditFn} onClose={mockOnCloseFn} marked={false} />
        );

        const tab = screen.getByRole("listitem");
       // const buttons = within(tab).getAllByRole("button");

        const editButton = within(tab).getByTestId("pen-icon");
        const checkbox = within(tab).getByTestId("checkbox");
        const closeButton = within(tab).getByTestId("close-light-icon");
     
        fireEvent.click(editButton);
        expect(mockEditFn ).toHaveBeenCalledWith(mockProps.id);

        
        fireEvent.click(editButton);
        expect(mockEditFn ).toHaveBeenCalledWith(mockProps.id);

        // Mark
        fireEvent.click(checkbox);
        expect(mockMarkFn).toHaveBeenCalledWith(mockProps.id, true);

        // Unmark
        fireEvent.click(checkbox);
        expect(mockMarkFn).toHaveBeenCalledWith(mockProps.id, false);

        fireEvent.click(closeButton);
        expect(mockOnCloseFn).toHaveBeenCalledWith(mockProps.id);
    })

    test("mockEditFn triggers automatically if url is invalid", () => {
        render(
            <TabItem {...mockProps} url="Tervehuolto" onEdit={mockEditFn} />
        );
        expect(mockEditFn ).toHaveBeenCalledWith(mockProps.id);
    });

    test("mockEditFn does not trigger automatically if url is invalid and mockEditFn is missing", () => {
        render(
            <TabItem {...mockProps} url="Terveyshuolto" />
        );
        expect(mockEditFn).not.toHaveBeenCalled();
    });

    test("url is used if label is empty", () => {
        render(
            <TabItem {...mockProps} label="" />
        );

        const tab = screen.getByRole("listitem");
        const link = within(tab).getByRole("link");

        expect(link).toHaveTextContent(mockProps.url);

    });
});