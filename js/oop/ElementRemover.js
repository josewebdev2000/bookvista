/* Handle operations to remove elements from the DOM */
class ElementRemover
{
    constructor (element_id)
    {
        this.element = $(element_id);
    }

    remove_children()
    {
        this.element.empty();
    }

    remove_element(css_selector = "")
    {
        this.element.remove(css_selector);
    }
}