export default function shuffle(array) {
  const suffledArray = array
  let arrayLength = suffledArray.length

  // While there remain elements to shuffle…
  while (arrayLength) {
    // Pick a remaining element…
    const randomIndex = Math.floor(Math.random() * arrayLength--)

    // And swap it with the current element.
    const lastElement = suffledArray[arrayLength]
    suffledArray[arrayLength] = suffledArray[randomIndex]
    suffledArray[randomIndex] = lastElement
  }

  return suffledArray
}
