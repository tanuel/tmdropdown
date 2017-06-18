/** ----- TmDropdown default configuration ----- 
 * default configuration/options for TmDropdown
 */
var TmDropdownConfig = {
    /**Indicates if the Dropdown should get closed when the document gets scrolled.
     * If false, the dropdown will move with the document, but can cause performance issues*/
    closeOnScroll: true,
    /**A text to display if the select is empty / doesnt have any options<*/
    emptyText: "No options available",
    /** A fixed width for the wrapper. You can use any valid CSS-Value here,
     * such as 100%, 130px or auto (auto is not recommended). **/
    width: undefined,
    /**additional class for the wrapper element (still contains tmDropdown-wrapper)*/
    wrapperClass: '',
    /**Callback for when the TmDropdown close() method is called.
     * This gets called at the start of the method. If the callback returns
     * false, the method will abort and nothing happens.
     * The callback gets passed a parameter with the instance of TmDropdown.
     * This corresponds to the select element.
     * @type function
     */
    onClose: undefined,
    /**Callback for when the TmDropdown destroy() method is called.
     * This gets called at the start of the method. If the callback returns
     * false, the method will abort and the dropdown will not get destroyed.
     * The callback gets passed a parameter with the instance of TmDropdown.
     * This corresponds to the select element
     * @type function
     */
    onDestroy: undefined,
    /**Callback for when the TmDropdown open() method is called.
     * This gets called at the start of the method. If the callback returns
     * false, the method will abort and nothing happens.
     * The callback gets passed a parameter with the instance of TmDropdown.
     * This corresponds to the select element
     * @type function
     */
    onOpen: undefined,
    /**Callback for when the TmDropdown select() method is called.
     * This gets called at the start of the method. If the callback returns
     * false, the method will abort and nothing happens. (Value doesnt get changed)
     * The callback gets passed two parameters:
     * first: instance of TmDropdown
     * second: Selected value
     * This corresponds to the select element
     * @type function
     */
    onOptionSelected:undefined,
    /**Callback method to call AFTER the TmDropdown refresh() method has finished
     * building the dropdown. Anything returned by the callback will be ignored.
     * The callback gets passed a parameter with the instance of TmDropdown.
     * This corresponds to the select element
     * @type function
     */
    onRefresh: undefined,
    /**Callback to call after the TmDropdown has initially finished building.
     * This callback will only be called once at the end of the constructor method.
     * This corresponds to the select element
     * @type function
     */
    onRendered: undefined
};

window.TmDropdownConfig = TmDropdownConfig;