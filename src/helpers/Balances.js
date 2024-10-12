export const addThousandthPoint = (balance) => { 
    let stringifiedBalance = parseInt(`${Math.abs(balance)}`).toString()
    if(stringifiedBalance.length <= 3) return parseInt(`${balance}`).toString()

    const splitedAndReversed = stringifiedBalance.split('').reverse()
    let pointed = splitedAndReversed.reduce((acum, currentNumber, currentIndex) => {
        if( (currentIndex+1) % 3 === 0 && splitedAndReversed[currentIndex+1] > 0){
            return ['.', currentNumber, ...acum]
        }

        return [currentNumber, ...acum]
    }, [])
    
    if( balance < 0 ) pointed.unshift('-')

    return pointed.join('')
}