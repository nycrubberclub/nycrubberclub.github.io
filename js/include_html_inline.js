document.addEventListener('DOMContentLoaded', html_template_insert);

function html_template_insert() {
    /*
    // Inserts HTML content from a template file into elements with the 'w3-include-html' attribute.
    // 
    // This function finds all elements with the 'w3-include-html' attribute, fetches the HTML content from the 
    // specified file URL, and inserts that content into the element. Once the content is loaded and inserted, 
    // the 'w3-include-html' attribute is removed to prevent multiple inserts.
    //
    //
    // EXAMPLE usage
    //
    // HTML code
    // <div w3-include-html="social_links.html" id="social_links" class="social_links"></div>
    //
    // OUTCOME
    // in the above case, populate the DIV w socail links from the file social_links.html
    // This allows changes to be made to the source file only, not every reference in many pages
    */
    var elements = document.querySelectorAll('[w3-include-html]');
    elements.forEach(function(elmnt) {
        // Load the specified include file
        var file = elmnt.getAttribute('w3-include-html');

        if (file) {
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    // insert the template file content into the element (DIV) text()
                    elmnt.innerHTML = data;
                    // remove all trace of the attribute so multiple inserts do not occur
                    elmnt.removeAttribute('w3-include-html');
                })
                .catch(error => {
                    console.error('Error loading file:', error);
                    elmnt.innerHTML = "Page not found.";
                });
        }
    });
}