import { iTabItem } from "./tab_item";

interface iTabGroup {
    desc: string,
    children: Array<JSX.Element> | JSX.Element
}

export default iTabGroup;