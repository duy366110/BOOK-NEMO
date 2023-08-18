"use strict"

let tabCategory = document.getElementById("tab-category");

window.addEventListener('scroll', function(event) {
    if(this.window.scrollY > 130) {
        tabCategory.classList.add('active');

    } else {
        tabCategory.classList.remove('active');
    }
})