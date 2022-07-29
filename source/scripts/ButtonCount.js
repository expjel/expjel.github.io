class ButtonCount extends HTMLElement {
    constructor() {
        super();

         /* shadow DOM base */
        const shadow = this.attachShadow({ mode: 'open' });

        /* add style */
        const buttonCountStyle = document.createElement('link');
        buttonCountStyle.setAttribute('rel', 'stylesheet');
        buttonCountStyle.setAttribute('href', './styles/button-count.css');


        /* Initialize counter */
        let counter = 0;

        /* create elements */
        const button = document.createElement('button');
        const counterContainer = document.createElement('span');
        button.textContent = 'Times Clicked: ';
        counterContainer.innerHTML = `${counter}`;

        /* Append counter container to button */
        button.appendChild(counterContainer);

        /* Add event listener to button */
        button.addEventListener('click', function() {
            counter += 1;
            counterContainer.innerHTML = `${counter}`;
        });

        /* append style and button to shadow dom */
        shadow.appendChild(buttonCountStyle);
        shadow.appendChild(button);
    }
}

customElements.define('button-count', ButtonCount);