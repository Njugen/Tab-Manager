import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { iTabItem } from "../../../interfaces/tab_item";
import TabItem from "../../../components/features/tab_item";

jest.mock("../../redux/mocked_hooks");
jest.useFakeTimers();
jest.setTimeout(10000);

const mockHandleMark = jest.fn();
const mockHandleEdit = jest.fn();
const mockHandleClose = jest.fn();

const mockTab1: iTabItem = {
    id: 0,
    label: "Bon Jovi",
    marked: false,
    url: "",
    disableCloseButton: true,
    disableEdit: true,
    disableMark: true
}

const mockTab2: iTabItem = {
    id: 0,
    label: "",
    marked: true,
    url: "http://google.com",
    onMark: mockHandleMark,
    onEdit: mockHandleEdit,
    onClose: mockHandleClose,
    disableCloseButton: false,
    disableEdit: false,
    disableMark: false
}

describe("Test tab rendering and feature cases", () => {
    test("Test simple (no optional props) tab render", () => {
        const { id, label, url, marked, disableCloseButton, disableEdit, disableMark } = mockTab1;
        
        render(
            <TabItem 
                id={id}
                label={label}
                url={url}
                marked={marked}
                disableCloseButton={disableCloseButton}
                disableEdit={disableEdit}
                disableMark={disableMark}
            />
        )

        const checkbox = screen.queryByTestId("checkbox");
        expect(checkbox).not.toBeInTheDocument();

        const closeButton = screen.queryByTestId("generic-icon-button-close");
        expect(closeButton).not.toBeInTheDocument();

        const editButton = screen.queryByTestId("generic-icon-button-edit");
        expect(editButton).not.toBeInTheDocument();

        const link = screen.getByRole("link", {name: label});
        expect(link).toHaveTextContent(label);
        expect(link).not.toHaveTextContent(url);
        expect(link).toHaveAttribute("href", url);
        expect(link).toHaveAttribute("target", "_blank");
    })

    test("Test advanced (with all props) tab render", () => {
        const { id, label, url, marked, onMark, onEdit, onClose, disableCloseButton, disableEdit, disableMark } = mockTab2;
        
        render(
            <TabItem 
                id={id}
                label={label}
                url={url}
                marked={marked}
                onMark={onMark}
                onEdit={onEdit}
                onClose={onClose}
                disableCloseButton={disableCloseButton}
                disableEdit={disableEdit}
                disableMark={disableMark}
            />
        )

        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toBeInTheDocument();

        const closeButton = screen.getByTestId("generic-icon-button-close_light");
        expect(closeButton).toBeInTheDocument();

        const editButton = screen.getByTestId("generic-icon-button-edit");
        expect(editButton).toBeInTheDocument();

        const link = screen.getByRole("link", {name: url});
        expect(link).toHaveTextContent(url);
        expect(link).not.toHaveTextContent(label);
        expect(link).toHaveAttribute("href", url);
        expect(link).toHaveAttribute("target", "_blank");

        fireEvent.click(checkbox);
        expect(mockHandleMark).toHaveBeenCalled();

        fireEvent.click(closeButton);
        expect(mockHandleClose).toHaveBeenCalled();

        fireEvent.click(editButton);
        expect(mockHandleEdit).toHaveBeenCalled();
    })

    test("Tab becomes editable when URL is invalid", () => {
        const { id, label, url, marked, onMark, onEdit, onClose, disableCloseButton, disableEdit, disableMark } = mockTab2;
        
        render(
            <TabItem 
                id={id}
                label={label}
                url={"aadakjfgh"}
                marked={marked}
                onMark={onMark}
                onEdit={onEdit}
                onClose={onClose}
                disableCloseButton={disableCloseButton}
                disableEdit={disableEdit}
                disableMark={disableMark}
            />
        )


        expect(mockHandleEdit).toHaveBeenCalled();
    })
})