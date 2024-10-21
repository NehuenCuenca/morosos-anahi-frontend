export const addThousandthPoint = (balance) => {  //https://stackoverflow.com/questions/42992340/javascript-how-to-set-dot-after-three-digits
    var parts = balance.toString().split(".");
    parts[0]= parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");

    return parts.join(",");
}