import { iSVG } from "../../interfaces/svg";

function CheckedIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M378-222 130-470l68-68 180 180 383-383 68 68-451 451Z"/></svg>);
}

export default CheckedIcon;