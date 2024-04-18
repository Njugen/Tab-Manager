// Determine what navigation link (sidebar links) to mark as preset
const presetActiveNavLink = (preset: string): string => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("#");
   
    if(urlSplit.length === 2){
      return urlSplit[1];
    } else {
      return "main";
    }
}
  
export default presetActiveNavLink;