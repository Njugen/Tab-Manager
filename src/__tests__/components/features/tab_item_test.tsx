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
    test("The tab itself renders", () => {
        render(
            <TabItem {...mockProps} />
        );

        const tab = screen.getByRole("listitem");

        expect(tab).toBeInTheDocument();
    });

    test("The tab has favicon", () => {
        render(
            <TabItem {...mockProps} />
        );

        const tab = screen.getByRole("listitem");
        const favicon = within(tab).getByRole("img");
        expect(favicon).toBeVisible();
    });

    test("The tab has a link", () => {
        render(
            <TabItem {...mockProps} />
        );

        const tab = screen.getByRole("listitem");
        const link = within(tab).getByRole("link");
        expect(link).toBeVisible()
    });

    test("Checkbox is visible and marking will trigger callback with relevant values", () => {
        render(
            <TabItem {...mockProps} onMark={mockMarkFn} marked={false} />
        );

        const tab = screen.getByRole("listitem");
        const checkbox = within(tab).getByTestId("checkbox");

        // Mark
        fireEvent.click(checkbox);
        expect(mockMarkFn).toHaveBeenCalledWith(mockProps.id, true);
    })

    test("Checkbox is visible and unmarking will trigger callback with relevant values", () => {
        render(
            <TabItem {...mockProps} onMark={mockMarkFn} marked={true} />
        );

        const tab = screen.getByRole("listitem");
        const checkbox = within(tab).getByTestId("checkbox");

        // Unmark
        fireEvent.click(checkbox);
        expect(mockMarkFn).toHaveBeenCalledWith(mockProps.id, false);
    })

    test("edit button (pen) is visible and triggers when clicked", () => {
        render(
            <TabItem {...mockProps} onEdit={mockEditFn} />
        );

        const tab = screen.getByRole("listitem");
        const editButton = within(tab).getByTestId("pen-icon");

     
        fireEvent.click(editButton);
        expect(mockEditFn).toHaveBeenCalledWith(mockProps.id);
    })
    
    test("close button (X) is visible and triggers when clicked", () => {
        render(
            <TabItem {...mockProps} onClose={mockOnCloseFn} />
        );

        const tab = screen.getByRole("listitem");
        const closeButton = within(tab).getByTestId("close-light-icon");

        fireEvent.click(closeButton);
        expect(mockOnCloseFn).toHaveBeenCalledWith(mockProps.id);
    })

    test("mockEditFn triggers automatically if url is invalid", () => {
        render(
            <TabItem {...mockProps} url="Tervehuolto" onEdit={mockEditFn} />
        );
        expect(mockEditFn).toHaveBeenCalledWith(mockProps.id);
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