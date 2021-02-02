const htmlStringTOJson = (htmlString) => {

    var htmlJson = {}

    const parser = new DOMParser()
    const htmlContent = parser.parseFromString(htmlString, 'text/html');


}


const htmlArrayToJson = (htmlArray) => {
    var arrayJson = {}

    for (let i = 0; i < htmlArray.childElementCount; ++i) {

    }
}
