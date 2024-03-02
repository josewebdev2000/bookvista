/** Define a Color Theme Changer 
 * Change Theme StyleSheet when this one is clicked
*/
class ThemeChanger
{
    constructor(element_id, stylesheet_element_id, stylesheet_url)
    {
        const self = this;
        this.element = $(element_id);
        this.stylesheet_element = $(stylesheet_element_id);

        this.element.click(function() {
            self.stylesheet_element.attr("href", stylesheet_url);
        });
    }
}
