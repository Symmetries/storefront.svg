import {html, svg, render} from '//unpkg.com/lit-html@2.2.6/lit-html.js?module';

import {createSvgContainer} from './svg-container.js'
import {createCustomizationContainer} from './customization-container.js';
import {SVG} from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js'

let data = [
  {
    name: "texture",
    title: "Wall Texture",
    amount: 5,
    mode: "mono",
  },
  {
    name: "roof",
    title: "Roof",
    amount: 5,
    mode: "mono",
  },
  {
    name: "door",
    title: "Door",
    amount: 5,
    mode: "mono",
  },
  {
    name: "window",
    title: "Window",
    amount: 5,
    mode: "mono",
  },
  {
    name: "frontdecor",
    title: "Front Decor",
    amount: 5,
    mode: "multi",
  }
]

let selections = {};
for (let datum of data) {
  if (datum.mode == "mono") {
    selections[datum.name] = 0;
  } else {
    selections[datum.name] = new Array(datum.amount).fill(false);
  }
  datum.files = {
    button: [],
    export: [],
  };
  datum.color = "#808080";
};


const setCssVars = () => {
  /*
    n * 70 + 35 + 17 + n * 14 ~= width
    n * 84 ~= width - 52
    n = round(width - 52 / 84)
  */
  document.querySelector(":root").style.setProperty('--n',
    Math.floor((window.innerWidth - 52)/84));
  window.requestAnimationFrame(setCssVars);
}
window.requestAnimationFrame(setCssVars);

let populateFileDatum = (type, datum) => {
  for (let i = 1; i <= datum.amount; i++) {
    let filename = `${type}/${datum.name}${i}.svg`;
    datum.files[type].push(filename);
  }
}

for (const datum of data) {
  populateFileDatum("button", datum);
  populateFileDatum("export", datum);
}

let fileContentMap = new Map();
for (const datum of data) {
  for (const filename of datum.files.export) {
    fileContentMap.set(filename, "");
  }
}

for (const filename of fileContentMap.keys()) {
  fetch(filename).then(res => res.text()).then(text => {
    fileContentMap.set(filename, text);
    update();
  })
}

const clickOption = (item, option) => () => {
  if (Array.isArray(selections[item])) {
    selections[item][option] = !selections[item][option];
  } else {
    selections[item] = option;
  }
  update();
}

const isSelected = (item, option) => {
  if (Array.isArray(selections[item])) {
    return selections[item][option];
  }
  return selections[item] == option;
}

const changeColor = datum => event => {
  datum.color = event.target.value;
  update();
}

const download = (type) => () => {
  let g = document.querySelector("#bbox");
  let bbox = g.getBBox();
  let svgString = `<svg width="${Math.ceil(bbox.width)}" height="${Math.ceil(bbox.height)}" viewBox="${Math.floor(bbox.x)} ${Math.floor(bbox.y)} ${Math.ceil(bbox.width)} ${Math.ceil(bbox.height)}" xmlns="http://www.w3.org/2000/svg">
    ${g.innerHTML}
  </svg>` 
  let svg = SVG(svgString);
  svg.flatten();
  let dataURL = "data:image/svg+xml;base64," +
    btoa(unescape(encodeURIComponent(svgString)));

  let downloadFile = (filename, dataURL) => {
    let link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    link.click();
  }
  if (type == "png") {
    let img = new Image();
    img.src = dataURL;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = 10 * img.width;
      canvas.height = 10 * img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 10 * img.width, 10 * img.height);
      downloadFile("building.png", canvas.toDataURL('image/png'));
    }
  } else {
    downloadFile("building.svg", dataURL);
  }
}

const mainPage = () => html`
  <style>
    html, body {
      height: 100%;
    }
    
    body {
      padding: 17px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 17px;
    }

    body > * {
      padding: 0 17px;
    }
    
    header {
      width: 100%;
      display: flex;
      gap: 14px;
    }

    header h1 {
      font-size: 40px;
      font-weight: 400;
      line-height: 50px;
      letter-spacing: 0em;
    }
    
    .logo, .title {
      border-radius: 5px;
    }
    
    .logo {
      width: 50px;
      height: 50px;
      background-image: url("other/logo.svg");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .title {
      flex-grow: 1;
      display: grid;
      align-items: center;
    }

    .title h1 {
      display: inline;
    }

    .svg-container {
      width: min(100%, calc(40vh /250 * 356));
      aspect-ratio: 356/250;
    }

    .customization-container {
      overflow-y: scroll;
      overflow-x: visible;
      padding-bottom: 17px;
      padding-right: 0;
      width: 100%;
      max-height: 100%;
    }

    footer {
      display: flex;
      width: 100%;
      gap: 17px;
      justify-content: center;
      align-items: center;
    }

    footer button {
      border-radius: 5px;
      border: none;
      height: 50px;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 700;
      line-height: 29px;
      letter-spacing: 0em;
      background: #7EAAF1;
      color: white;
      width: calc(min(100%, 356px) / 2);
    }

    @media (min-width: 800px) {
      body {
        display: grid;
        grid-template-areas: "h h"
                             "c s"
                             "c f";
        gap: 0 5vw;
        grid-template-columns: 1fr 2fr;
        padding-left: 6vw;
        padding-right: 6vw;
      }
      header {
        grid-area: h;
      }
      .customization-container {
        grid-area: c;
        place-self: start center;
      }
      .svg-container {
        place-self: center end;
        grid-area: s;
        width: min(100%, calc(80vh /250 * 356));
      }
      footer {
        grid-area: f;
        place-self: end end;
        justify-content: flex-end;
      }
    }
  </style>
  <header>
    <div class="logo"></div>
    <div class="title"><h1>storefront.svg</h1></div>
  </header>
  <div class="svg-container">
    ${createSvgContainer(data, selections, fileContentMap)}
  </div>
  <div class="customization-container">
    ${createCustomizationContainer(data, isSelected, clickOption, changeColor)}
  </div>
  <footer>
    <button @click="${download("svg")}">save as svg</button>
    <button @click="${download("png")}">save as png</button>
  </footer>
`;


let ctx = document.createElement('canvas').getContext('2d');

function update() {
  render(mainPage(), document.body);

  const hex2rgb = c => {
    if (c.charAt(0) == "#" && c.length == 7) {
      return [c.substring(1,3), c.substring(3, 5), c.substring(5,7)]
        .map(x => Number("0x" + x) / 255);
    }
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    let col = ctx.getImageData(0, 0, 1, 1);
    return [col.data[0]/255, col.data[1]/255, col.data[2]/255];
  };

  const isGreyScale = ([r, g, b]) => r == g && g == b;

  const mapBrightness = y => l => {
    let f = x => 2 * l * x;
    let g_ = x => 2 * (x - 0.5) * (1 - l) + l;
    let h1 = x => Math.max(f(x), g_(x));
    let h2 = x => Math.min(f(x), g_(x));
    let h = x => l > 0.5 ? h2(x) : h1(x);
    return 255 * h(y);
  };

  const rgb2str = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;
  
  let colorMap = {
    fill: new Map(),
    stroke: new Map(),
  };
  
  for (let type of ["fill", "stroke"]) {
    for (const datum of data) {
      document.querySelectorAll(`svg.${datum.name} [${type}]`).forEach(element => {
        let rgb = hex2rgb(element.getAttribute(type));
        if (isGreyScale(rgb)) {
          colorMap[type].set(element, rgb[0]);
        }
      })
    }
  }

  for (let type of ["fill", "stroke"]) {
    for (const datum of data) {
      document.querySelectorAll(`svg.${datum.name} [${type}]`).forEach(element => {
        if (colorMap[type].has(element)) {
          let brightness = colorMap[type].get(element);
          let rgb = hex2rgb(datum.color).map(mapBrightness(brightness));
          let color = rgb2str(rgb);
          element.setAttribute(type, color);
        }
      })
    }
  }
}

update();