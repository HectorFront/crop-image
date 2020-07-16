const applyButton = document.getElementById('apply')
let camWidth;
let camHeight;

const setUpApplyButton = function () {
    let camImage = new Image();
    camImage.src = "images.png";
    let pointsArray = []
    const children = document.querySelectorAll('#window_g .handle')
    children.forEach(e => {
        const pos = e.getAttribute('transform');
        const point = pos.replace('translate(', '').replace(')', '').split(',')
        pointsArray.push(point[0])
        pointsArray.push(point[1])
    })
    console.log(pointsArray)
    console.log(
        {
            width: Number(camImage.width),
            height: Number(camImage.height),
            x1: pointsArray[0] <= 0 ? 0 : pointsArray[0] > Number(camImage.width) ? camImage.width : Number(pointsArray[0]),
            x2: pointsArray[2] <= 0 ? 0 : pointsArray[2] > Number(camImage.width) ? camImage.width : Number(pointsArray[2]),
            y1: pointsArray[3] <= 0 ? 0 : pointsArray[3] > Number(camImage.height) ? camImage.height : Number(pointsArray[3]),
            y2: pointsArray[5] <= 0 ? 0 : pointsArray[5] > Number(camImage.height) ? camImage.height : Number(pointsArray[5])
        }
    )
}
applyButton.onclick = setUpApplyButton
