window.onload = function(event) {
    const $ = document.querySelector.bind(document);
    let hamburger = $('#header-hamburger');

    console.log(hamburger);

    hamburger.addEventListener('click', (event) => {
        hamburger.classList.toggle('active');
    })
}