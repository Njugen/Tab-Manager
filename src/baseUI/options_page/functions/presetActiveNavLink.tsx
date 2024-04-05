// Determine what navigation link (sidebar links) to mark as preset
const presetActiveNavLink = (preset: string): string => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("?");
  
    if(urlSplit.length === 2){
      
      const paramSplit: Array<string> =  urlSplit[1].split("=");
      const val: string = paramSplit[1];
  
      return val;
    } else {
      return preset;
    }
}
  
export default presetActiveNavLink;