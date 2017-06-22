/** ----- TmDropdown main class ----- 
 * Available options:
 * width - width of the wrapper
 * wrapperClass - additional class for the tmDropdown-wrapper element
 * @type TmDropdown
 */
class TmDropdown {

    constructor(domElement, options = undefined) {
        (domElement.nodeName.toUpperCase() !== 'SELECT') && throw "Element is not a Select";
        
        this._domElement = domElement;
        this._options = (typeof options === 'object') && Object.assign({},TmDropdownConfig,options) || {};

        this._dropdown = this._buildDropdown();
        domElement.style = Object.assign({},docElement.style, {
            visibility: "hidden",
            position: "absolute"
        });
        domElement.parentNode.insertBefore(this._dropdown, domElement.nextSibling);
        domElement.TmDropdown = this;

        const addDocEvent = document.documentElement.addEventListener;
        addDocEvent("mousedown", this._closeByGlobalEvent.bind(this));
        addDocEvent("touchstart", this._closeByGlobalEvent.bind(this));
        
        window.addEventListener("blur", this.close.bind(this));
        
        const closeOrReposition = this.getOption("closeOnScroll") && this._closeByGlobalEvent || this._respositionByGlobalEvent;
        
        window.addEventListener("scroll", closeOrReposition.bind(this), true);
        
        this._callCallback("Rendered");
    }
    
    /**
     * indicates wether the dropdown is currently opened or not
     * @type boolean
     */
    get isOpen() {
        return this._dropdown.classList.contains("tmDropdown-open");
    }
    
    /**
     * indicates if the dropdown contains any options
     * @type boolean
     */
    get isEmpty(){
        return (this._domElement.children.length === 0);
    }
    
    /**
     * Wrapper function for callbacks. Checks if the callback is a function and 
     * then calls it
     * @param {string} name
     * Name of callback (without on, like "Open" or "Rendered")
     * @param {mixed} param
     * a secondary parameter to be passed to the callback
     * @returns {mixed}
     * returns the return value of the callback
     */
    _callCallback(name,param = undefined){
        const onFn = this.getOption("on" + name);
        (typeof onFn === 'function') && onFn.bind(this._domElement,this,param)();
    }
    
    /**
     * get an option
     * @param {string} key
     * @returns {string} option value
     */
    getOption(key) {
        switch (key) {
            case 'width':
                return this._options.width || TmDropdownConfig[key] || window.getComputedStyle(this._domElement).width;
            default:
                return this._options[key] || TmDropdownConfig[key];
        }

    }
    /**
     * set an option
     * @param {string} key
     * @param {string} value
     */
    setOption(key, value) {
        this._options[key] = value;
    }

    /**
     * Event handler for global mousedown or touchstart event to close
     * dropdown when something else is clicked
     * 
     * @param {Object|Event} event
     */
    _closeByGlobalEvent(event) {
        if (this._dropdown !== event.target && !this._dropdown.contains(event.target)
            && this._optionsUL !== event.target && !this._optionsUL.contains(event.target)) {
            this.close();
        }
    }


    _repositionByGlobalEvent(ev){
        if(this._optionsUL !== ev.target && !this._optionsUL.contains(ev.target)){
            this.repositionOptionsUL();
        }
    }
    
    repositionOptionsUL(){
        if(this.isOpen){
            const rect = this._dropdown.getBoundingClientRect();
            const cssString = [
                'position: fixed',
                'display: block',
                'left: ' + rect.left + 'px',
                'top: ' + rect.top + 'px',
                'bottom: ' + rect.bottom + 'px',
                'width: ' + rect.width + 'px'
            ].join(";");
            
            document.body.appendChild(this._optionsUL);
            
            this._optionsUL.style.cssText = cssString;

            //If the dropdown is too far to the bottom of the screen, open it to the top
            if(this._optionsUL.getBoundingClientRect().bottom > window.innerHeight){
                const rectUL = this._optionsUL.getBoundingClientRect();
                this._optionsUL.style.top = (rect.top - rectUL.height)+"px";
                this._optionsUL.classList.add("tmDropdown-ul-top");
            } else {
                this._optionsUL.classList.remove("tmDropdown-ul-top");
            }
        }
    }

    /**
     * Open the dropdown. 
     * the onOpen callback wont get called if the dropdown is empty!
     */
    open() {
        if(this.isEmpty || this._callCallback("Open") === false){
            return;
        }
        
        this._dropdown.classList.add("tmDropdown-open");
        this.repositionOptionsUL();
        
        //scroll to selected element
        const selectedElement = this._optionsUL.getElementsByClassName("tmDropdown-active")[0];
        
        if (selectedElement) {
            this._optionsUL.scrollTop = selectedElement.offsetTop - (this._optionsUL.offsetHeight / 2);
        }
    }
    
    /**
     * Close the dropdown.
     * The onClose callback wont get called, if the Dropdown is already closed!
     */
    close() {
        if(!this.isOpen || this._callCallback("Close") === false){
            return;
        }
        
        this._dropdown.classList.remove("tmDropdown-open","tmDropdown-open-top");
        this._dropdown.appendChild(this._optionsUL);
        this._optionsUL.style.cssText = '';
    }

    /**
     * Open or close the dropdown, depending on current state
     * This method wont trigger callbacks itsself, but calls for open or close and
     * triggers those callbacks
     */
    toggle() {
        this._dropdown.classList.contains("tmDropdown-open") && this.close() || this.open();
    }

    /**
     * Refresh content in the dropdown
     */
    refresh() {
        this._optionsUL.parentNode.removeChild(this._optionsUL);
        this._dropdown.parentNode.removeChild(this._dropdown);
        this._dropdown = this._buildDropdown();
        this._domElement.parentNode.insertBefore(this._dropdown, this._domElement.nextSibling);
        
        this._callCallback("Refresh");
    }

    /**
     * Remove TmDropdown from DOM and show the select element
     */
    destroy() {
        if(this._callCallback("Destroy")  === false){
            return
        }
        this._dropdown.parentNode.removeChild(this._dropdown);
        this._domElement.style.visibility = "";
        this._domElement.style.position = "";
        delete this._domElement.TmDropdown;
    }

    /**
     * Select a value and refresh the dropdown
     * Will dispatch a change Event
     * 
     * @param {string} value
     */
    select(value) {
        if(this._callCallback("OptionSelected",value) === false){
            return
        }
        this._domElement.value = value;
        this.refresh();
        const changeEvent = new Event('change', {bubbles: true});
        
        this._domElement.dispatchEvent(changeEvent);
    }
    
    _selectByClickEvent(ev){
        let el = ev.target;
        if (typeof el.dataset.value !== 'undefined') {
                this.select(el.dataset.value);
                this.close();
        }
    }
    
    /**
     * Builds the dropdown DOM element
     * 
     * @returns {Element}
     * HTML div element with dropdown content
     * @internal
     */
    _buildDropdown() {
        let select = this._domElement;
        let wrapper = document.createElement("div");
        let current = document.createElement("div");
        
        wrapper.className = 'tmDropdown-wrapper ' + this.getOption("wrapperClass");
        wrapper.style.width = this.getOption("width");

        current.className = 'tmDropdown-current';
        
        //if the select doesnt have any options, set different text
        if (select.selectedIndex !== -1) {
            current.textContent = select.options[select.selectedIndex].textContent;
        } else {
            current.textContent = this.getOption("emptyText");
            wrapper.style.width = "auto";
        }
        current.addEventListener("click", this.toggle.bind(this));

        const ul = this._optionsUL = document.createElement("ul");
        ul.className = 'tmDropdown-ul';

        const children = this._domElement.children;
        
        Array.prototype.map.call( this._domElement.children, function(c){
            let optFn;
            optFn = (c.tagName === 'OPTION' && this._buildOption) || (c.tagName === 'OPTGROUP' && this._buildOptgroup);
            optFn && ul.appendChild(optFn);
        });
        
        ul.addEventListener("click",this._selectByClickEvent.bind(this),true);

        wrapper.appendChild(current);
        wrapper.appendChild(ul);
        return wrapper;
    }

    /**
     * Create a list element for an option
     * 
     * @param {Element|option} option
     * A HTML Option Element
     * @returns {Element|TmDropdown._buildOption.li}
     * @internal
     */
    _buildOption(option) {
        const li = document.createElement("li"),
              selected = option.selected && ' tmDropdown-active' || '',
              disabled = option.disabled && ' tmDropdown-disabled' || '';
        
        li.textContent = option.textContent;
        li.className = 'tmDropdown-li' + selected + disabled;
        li.dataset.value = option.value;
        return li;
    }
    
    /**
     * will create a list element for an optgroup
     * iterates through children to find options
     * This method will call _buildOption to generate the option list elements
     * 
     * @param {type} optgroup
     * a html optgroup element
     * @returns {TmDropdown._buildOptgroup.li|Element}
     * @internal
     */
    _buildOptgroup(optgroup) {
        const create = document.createElement,
              options = optgroup.children,
              li = create("li"),
              label = create("div"),
              ul = create("ul");
        
        li.className = "tmDropdown-optgroup";
        label.className = "tmDropdown-optgroup-label";
        label.textContent = optgroup.label;
        ul.className = "tmDropdown-optgroup-options";
        
        Array.prototype.map.call(options, function(option) {
            ul.append(this._buildOption(option));
        });

        li.append(label);
        li.append(ul);
        
        return li;
    }
}
//assign TmDropdown to window to make it global
window.TmDropdown = TmDropdown;
