document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll('[w3-include-html]');
    elements.forEach(function(elmnt) {
        var file = elmnt.getAttribute('w3-include-html');
        if (file) {
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    elmnt.innerHTML = data;
                    elmnt.removeAttribute('w3-include-html');
                })
                .catch(error => {
                    console.error('Error loading file:', error);
                    elmnt.innerHTML = "Page not found.";
                });
        }
    });
});

// function includeHTML() {
//     var elements = document.querySelectorAll('[w3-include-html]');
//     elements.forEach(function(elmnt) {
//         var file = elmnt.getAttribute('w3-include-html');
//         if (file) {
//             fetch(file)
//                 .then(response => response.text())
//                 .then(data => {
//                     elmnt.innerHTML = data;
//                     elmnt.removeAttribute('w3-include-html');
//                 })
//                 .catch(error => {
//                     console.error('Error loading file:', error);
//                     elmnt.innerHTML = "Page not found.";
//                 });
//         }
//     });
// }

// window.onload = includeHTML;