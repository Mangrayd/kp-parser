# Kinopoisk Parser (for node.js)

## Install (npm)
```
npm i kp-parser -S
```
## Usage
```
const KPparser = require('./index');

const myParser = new KPparser();
      myParser.parseKinopoiskFilm('film-id-from-url-here')
        .then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(`err: ${err}`);
        });
```
