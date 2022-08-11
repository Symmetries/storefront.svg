import {html} from '//unpkg.com/lit-html@2.2.6/lit-html.js?module';

export const createCustomizationContainer = (data, isSelected, clickOption, changeColor) => html`
  <style>
    .customization-container h2 {
      padding: 24px 24px 24px 0;
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 29px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .customization-container h2 span {
      background-image: url("other/colorbutton.svg");
      background-size: cover;
      height: 40px;
      width: 40px;
    }

    .customization-container h2 input[type="color"] {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    
    .customization-section {
      overflow-x: auto; 
      width: 100%;
      display: flex;
      gap: 14px;
      padding-right: 17px;
    }
    
    .customization-section img{
      pointer-events: none;
      user-select: none;
    }

    .customization-item-container {
      display: grid;
      place-items: center;
      grid-template-areas: "a";
    }

    .customization-item-container > img {
      width: 100%;
      opacity: 0;
      transition: opacity 300ms ease-in-out;
    }

    .customization-item-container.selected > img {
      opacity: 100%;
      transition: opacity 300ms ease-in-out;
    }
    
    .customization-item-container > * {
      grid-area: a;
    }

    .customization-item {
      --side: calc((100vw - 17px - 14px * var(--n)) / (var(--n) + 0.5));
      width: var(--side);
      aspect-ratio: 1/1;
      border: 4px solid #d9d9d9;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      transition: border-color 300ms ease-in;
    }

    @media (min-width: 800px) {
      .customization-item {
        width: 70px;
      }
      .customization-section {
        flex-wrap: wrap;
      }
    }

    .customization-item.mono {
      border-radius: 15px;
    }
    
    .customization-item.multi {
      border-radius: 5px;
    }

    .customization-item-container:hover > .customization-item {
      border-color: #C5DBFF;
      transition: border-color 300ms ease-out;
    }
    
    .customization-item.square-item {
      border-radius: 5px;
    }


    .customization-item-container.selected > .customization-item {
      border: 4px solid #7EAAF1;
    }

    .customization-item > img {
      width: 80%;
      aspect-ratio: 1/1;
      object-fit: contain;
    }
  </style>
  ${data.map(datum => html`
    <h2>${datum.title} 
      <span>
        <input type="color" @input="${changeColor(datum)}" value="${datum.color}">
      </span>
    </h2>
    <div class="customization-section">
      ${datum.files.button.map((file, i) => html`
        <div
          @click="${clickOption(datum.name, i)}" 
          class="customization-item-container ${isSelected(datum.name, i) ? "selected" : ""}"
        >
          <img class="outline" src="other/${datum.mode}.svg"/>
          <div 
            class="customization-item ${datum.mode}">
            ${i < datum.files.button.length ? html`
              <img 
                src="${datum.files.button[i]}"/>
            ` : ""}
          </div>
        </div>
      `)}
    </div>
  `)}
`;