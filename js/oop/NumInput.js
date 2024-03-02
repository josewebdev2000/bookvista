/** Input Element that only accepts digits */
class NumInput
{
    constructor (element_selector)
    {
        this.element = $(element_selector);

        // Make sure only numbers are included in the pages input
        this.element.on("keydown", function (e) {
            if (!doesStringContainAWholeNumber(String.fromCharCode(e.keyCode)) && e.keyCode != 8) 
            {
                // Prevent the default action for non-digit keys
                e.preventDefault();
            }
        });
    }
}