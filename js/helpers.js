/** Helper functions to assist the web app */
function getIdNumberFromBookCardButtonId(btn_id)
{
    /** Return the number from the id of every button of each book card */
    const btn_id_parts = btn_id.split("-");
    const number_id = btn_id_parts[btn_id_parts.length - 1];

    return number_id;
}

function doesStringContainAWholeNumber(the_str)
{
    /** Regex to check for whole numbers */
    const wholeNumsRegex = /\b(?:[1-9]\d*|0)\b/;
    return wholeNumsRegex.test(the_str);
}

function getButtonIdFromBookCardNumber(btn_type, btn_num_id)
{
    /** Grab the button id from the number id of a book card */
    return `btn-${btn_type}-${btn_num_id}`;
}

function truncateString(str, maxLength) 
{
    /** Truncate a string to a maximum length */
    if (str.length > maxLength) 
    {
        return str.slice(0, maxLength) + "...";
    }
    return str;
}