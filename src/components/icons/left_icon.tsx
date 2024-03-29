import { iSVG } from "../../interfaces/svg";

function LeftIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>);
}

export default LeftIcon;