import { iSVG } from "../../interfaces/svg";

function NewFolderIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M560-320h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z"/></svg>);
}

export default NewFolderIcon;