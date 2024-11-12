export const getTodayDateFormated = () => { 
    const [ date, time ] = new Intl.DateTimeFormat('es-AR', {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
    }).format(new Date()).split(', ')

    const reversedDate = date.split('/').reverse().join('-')
    const slicedTime = time.slice(0,5)

    return `${reversedDate}T${slicedTime}`
}