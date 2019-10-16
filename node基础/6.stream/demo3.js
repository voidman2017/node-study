const fs = require('fs')
const path = require('path');
const rpath = (url) => path.join(__dirname, url)
function pipe(source, target) {
    let rs = fs.createReadStream(rpath(source), { highWaterMark: 4 })
    let ws = fs.createWriteStream(rpath(target), { highWaterMark: 1 })

    rs.on('data', (chunk) => {
        if (ws.write(chunk) === false) {
            console.log(chunk)
            rs.pause();
        }
    })

    ws.on('drain', () => { rs.resume() })

    rs.on('end', () => { ws.end() })
}
// pipe('./1.html', './2.html')

function pipe2(source, target) {
    let rs = fs.createReadStream(rpath(source), { highWaterMark: 4 })
    let ws = fs.createWriteStream(rpath(target), { highWaterMark: 1 })
    rs.pipe(ws)
}
pipe2('./1.html', './2.html')

