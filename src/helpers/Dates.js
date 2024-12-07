export const getTodayDateFormated = () => { 
    const [ date, time ] = new Intl.DateTimeFormat('es-AR', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
    }).format(new Date()).split(', ')

    const reversedDate = date.split('/').reverse().join('-')

    return `${reversedDate}T${time}`
}