/**
 * Creates a custom web component with a shadow DOM encapsulation.
 *
 * @param {string} componentName - The name of the custom element to be defined.
 * @param {string} style - The CSS styles to be applied to the component's shadow DOM.
 * @param {string} defaultContent - The default content of the component.
 * @param {function} contentFunction - A callback function that provides dynamic content for the component.
 *                                    It receives the component instance as an argument and returns the dynamic content.
 */
function createComponent(componentName,style,defaultContent,contentFunction){
	class customComponent extends HTMLElement {
		constructor(){
			super();
			this.attachShadow({ mode: 'open' });
			this.Ctyle   = style
			this.Content = defaultContent
		}
		refresh(){
			const isEmpty = this.shadowRoot.children.length != 2
			let styleElement,divElement;
			if(isEmpty){
				styleElement = document.createElement("style")
				divElement   = document.createElement("div")
				divElement.className = "container"
			}else{
				styleElement = this.shadowRoot.firstChild
				divElement   = this.shadowRoot.lastChild
			}
			styleElement.textContent = this.Ctyle
			divElement.innerHTML     = this.Content
			if(isEmpty){
				this.shadowRoot.appendChild(styleElement)
				this.shadowRoot.appendChild(divElement)
			}
		}
		connectedCallback() {
			setTimeout(() => {
				if(contentFunction!=null){
					this.Content = contentFunction(this);
					this.innerHTML = ''
				}
				this.refresh();
			} );
		}
	}
	customElements.define(componentName, customComponent);
}

function From(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.readyState === 4 && xhr.status === 200) {
        return xhr.responseText;
    } else {
        throw new Error("Request failed");
    }
}
function createComponentFrom(componentName,cssFile,htmlFile,contentFunction){
	return createComponent(
		componentName,
		From(cssFile),
		Mustache.render(From(htmlFile[0]),htmlFile[1]),
		contentFunction
	)
}