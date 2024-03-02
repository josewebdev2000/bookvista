/** Class that adds a new child element to its parent */
class ChildAppender
{
    constructor (parent_selector)
    {
        this.parent = $(parent_selector);
    }

    append_child(child_html)
    {
        const child = $(child_html);
        this.parent.append(child);
    }
}