import {html, svg} from '//unpkg.com/lit-html@2.2.6/lit-html.js?module';
import {unsafeSVG} from 'https://unpkg.com/lit-html@2.2.6/directives/unsafe-svg.js?module';

export const createSvgContainer = (data, selections, fileContentMap) => html`
  <style>
    .svg-container svg {
      width: 100%;
      height: 100%;
      background-image: url("other/sky.svg");
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 5px;
    }
  </style>
  <svg id="output" width="356" height="250" viewBox="0 0 356 250" xmlns="http://www.w3.org/2000/svg">
    <g id="bbox">
      ${data.map(datum => {
        if (Array.isArray(selections[datum.name])) {
          let files = datum.files.export.filter((_, i) => selections[datum.name][i]);
          return files.map(filename =>
            imagePlacer(filename, fileContentMap, datum));
        } else {
          return imagePlacer(datum.files.export[selections[datum.name]], fileContentMap, datum);
        }
      }).flat()}
    </g>
  </svg>
`;

export const imagePlacer = (filename, fileContentMap, datum) => {
  let x = 0;
  let y = 0;
  let width = 356;
  let height = 250;

  if (datum.name == "door") {
    x = 88;
    width = 90;
  } if (datum.name == "window") {
    x = 178;
    width = 90;
  }

  // random class is to force a reupdate
  return unsafeSVG(`
    <svg x="${x}" y="${y}" width="${width}" height="${height}" class="${datum.name} rand${Math.random()}">
      ${fileContentMap.get(filename)}
    </svg>
  `)
};