/** Error Alert to be shown in the main page when no books could be found */
function bErrorAlert(title, message)
{
    return `
    <div class="alert alert-danger main-page-alert" role="alert">
            <h2>${title}</h2>
            <img src="assets/img/oops.png" alt="Error Picture">
            <p>${message}</p>
    </div>
`;
}

function bInfoAlert(title, message)
{
    return `
    <div class="alert alert-info main-page-alert" role="alert">
        <h2>${title}</h2>
        <img src="assets/img/poker-face.png" alt="Info Picture">
        <p>${message}</p>
    </div>
    `;
}