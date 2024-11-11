export const getTodayDateFormated = () => { 
    const [ date, time ] = new Date().toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires",  hour12: false}).split(', ')
    const reversedDate = date.split('/').reverse().join('-')
    const slicedTime = time.slice(0,5)
    console.log(`${reversedDate}T${slicedTime}`);

    return `${reversedDate}T${slicedTime}`
}