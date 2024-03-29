import { iSVG } from "../../interfaces/svg";

function TrashIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M261-120q-24 0-42-18t-18-42v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm106-146h60v-399h-60v399Zm166 0h60v-399h-60v399Z"/></svg>);
}

export default TrashIcon;