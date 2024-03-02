/** Return Dynamic HTML String to represent a Book Card */
function bBookCard(id, title, author, description, image_url)
{
    /** HTML String representation of this instance */
    return `<div class="col" id="${id}">
    <div class="card shadow-sm pt-3 d-flex justify-content-center align-items-center">
        <div class="card-img-container">
            <img class="card-img-top book-pic" src="${(image_url) ? image_url : "assets/img/book.png"}" alt="${title} Picture">
        </div>
        <div class="card-body">
            <h3 class="card-text book-title text-center">${title}</h3>
            <h6 class="text-body-secondary book-author text-center">${(author) ? author : "No Author Specified"}</h6>
            <p class="card-text book-desc text-center">${(description) ? ((description.length <= maxDescriptionCardLength) ? description : truncateString(description, maxDescriptionCardLength)) : "No Description Specified"}</p>
            <div class="d-flex justify-content-center align-items-center">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-info text-white btn-view" id="btn-view-${id}" data-bs-toggle="modal" data-bs-target="#view-book-modal">View</button>
                    <button type="button" class="btn btn-sm btn-primary btn-edit" id="btn-edit-${id}" data-bs-toggle="modal" data-bs-target="#edit-book-modal">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger btn-delete" id="btn-delete-${id}" data-bs-toggle="modal" data-bs-target="#delete-book-modal">Delete</button>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

function bCompleteBookCard(title, author, description, image_url, pages, read)
{
    /** HTML String representation of this instance */
    return `
            <div class="card shadow-sm pt-3 d-flex justify-content-center align-items-center">
                <div class="card-img-complete-container">
                    <img class="card-img-top book-pic" src="${(image_url) ? image_url : "assets/img/book.png"}" alt="${title} Picture">
                </div>
                <div class="card-body">
                    <h3 class="card-text book-title text-center">${title}</h3>
                    <h6 class="text-body-secondary book-author text-center">${(author) ? author : "No Author Specified"}</h6>
                    <p class="card-text book-desc text-center">${(description) ? description : "No Description Specified"}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        ${(read) ? "<span class='bg-success text-white rounded-pill p-2'>Read</span>" : "<span class='bg-danger text-white rounded-pill p-2'>Not Read</span>"}
                        <small class="text-body-secondary">${pages > 0 ? `${pages} pages` : "Page Number Not Specified"}</small>
                    </div>
                </div>
            </div>
        </div>`
        ;
}