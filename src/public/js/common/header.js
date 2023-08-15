window.onload = function(event) {
    const $ = document.querySelector.bind(document);
    let hamburger = $('#header-hamburger');
    let navigationtab = $('#navigation-tab');
    let tabmask = $('#tab-mask');

    hamburger.addEventListener('click', (event) => {
        hamburger.classList.toggle('active');
        navigationtab.classList.add('active');
    })

    tabmask.addEventListener('click', (event) => {
        hamburger.classList.remove('active');
        navigationtab.classList.remove('active');
    })
}