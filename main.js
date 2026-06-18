const slides = document.querySelectorAll(".slide");

let current = 0;

function showSlide(index){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");

    document.getElementById("page").textContent =
        `${index + 1} / ${slides.length}`;
}

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){
        current = Math.min(
            current + 1,
            slides.length - 1
        );
    }

    if(e.key==="ArrowLeft"){
        current = Math.max(
            current - 1,
            0
        );
    }

    showSlide(current);
});