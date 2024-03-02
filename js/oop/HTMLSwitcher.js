/** Software Object that changes its HTML content between two HTML Strings */
class HTMLSwitcher
{
    constructor(element_selector, html_str_1, html_str_2)
    {
        this.element = $(element_selector);
        this.html_1 = html_str_1;
        this.html_2 = html_str_2;
    }


    switch_to_html_1()
    {
        this.element.html(this.html_1);
    }

    switch_to_html_2()
    {
        this.element.html(this.html_2);
    }
}