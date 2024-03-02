/** Helper functions to alter the DOM */
function appendManyChildToParent(parent_selector, childs_html)
{
    // Create an instance of the ChildAppender Object
    const childAppender = new ChildAppender(parent_selector);

    // Loop through all HTML representations of the childs
    for (let child_html of childs_html)
    {
        childAppender.append_child(child_html);
    }
}

function appendOneChildToParent(parent_selector, child_html)
{
    // Create an instance of the ChildAppender Object
    const childAppender = new ChildAppender(parent_selector);

    // Add the child's html to the parent
    childAppender.append_child(child_html);
}

function removeAllChildrenFromParent(parent_selector)
{
    // Create an instance of the element remover
    const elementRemover = new ElementRemover(parent_selector);

    // Remove all children
    elementRemover.remove_children();
}

function displayPostFormOnModal()
{
    const postModalContainer = $("#post-book-modal .modal-content");
    postModalContainer.html("");
    postModalContainer.html(postModalContent); 
}

function displayErrorAlertOnModal(title, message)
{
    const postModalContainer = $("#post-book-modal .modal-content");
    postModalContainer.html("");
    postModalContainer.html(bErrorModalContentHTMLString(title, message)); 
}

function showDefaultPostModalContent()
{
    $("div.error-content").hide();
    $("div.default-content").fadeIn().show();
}

function showErrorPostModalContent()
{
    $("div.default-content").hide();
    $("div.error-content").fadeIn().show();
}

function feedTextToErrorPostModalContent(title, message)
{
    $("#error-post-modal-title").text(title);
    $("#error-post-modal-message").text(message);
}

function feedTextToErrorEditModalContent(title, message)
{
    $("#error-edit-modal-title").text(title);
    $("#error-edit-modal-message").text(message);
}

function tryAgainShowDefaultModalOnClick()
{
    $("#btn-try-again").on("click", showDefaultPostModalContent);
    resetPostForm();
}

function tryAgainEditShowDefaultModalOnClick()
{
    $("#btn-edit-try-again").on("click", showDefaultPostModalContent);
}

function newBookShowDefaultModalOnClick()
{
    $("#new-book").on("click", showDefaultPostModalContent);
}

function resetPostForm()
{
    $("form#post-new-book-form")[0].reset();
    $("#new-book-pages").val(0);
}


function hideErrorContentByDefault()
{
    $("div.error-content").hide();
}

function sidebarShowOnClick()
{
    $("#sidebar-shower").on("click", function () {
        sidebarToggleOperations();
    });
}

function sidebarToggleOperations()
{
    $("#dom-hidder").fadeToggle();
    $("body").toggleClass("no-scroll");
}

function fadeOutHelperWidgetsOnModalShow()
{
    $(".modal").on("show.bs.modal", function () {
        const elementsToFadeOut = ["#sidebar-shower", ".gtranslate_wrapper", ".bd-mode-toggle"];
        elementsToFadeOut.forEach(s => $(s).fadeOut());
    });
}

function fadeInHelperWidgetsOnModalHidden()
{
    $(".modal").on("hidden.bs.modal", function () {
        const elementsToFadeOut = ["#sidebar-shower", ".gtranslate_wrapper", ".bd-mode-toggle"];
        elementsToFadeOut.forEach(s => $(s).fadeIn());
    });
}

/*

Fix bug for dynamic textarea

function resizeTextArea(textAreaSelector)
{
    const textarea = $(textAreaSelector);

    // Trigger resizing on input event
    textarea.on('input', function() {
        textarea.css("height", "auto");
        textarea.css('height', (textarea[0].scrollHeight) + 'px');
        console.log((textarea[0].scrollHeight));
    });
}
*/