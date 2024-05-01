/*
    Firefox and Chrome use different datatypes when working with
    tab ids. This type is a union to satisfy that condition.
*/

type tBrowserTabId = number | string;

export default tBrowserTabId