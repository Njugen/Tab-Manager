import { iSVG } from "../../interfaces/svg";

function RightIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>);
}

export default RightIcon;