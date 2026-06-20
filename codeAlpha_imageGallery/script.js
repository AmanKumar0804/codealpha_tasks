const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let activeImages = []; // Stores images currently visible under active filter category
let currentImgIndex = 0;

// --- 1. Filter Category System ---
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Switch button state highlighting 
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === itemCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// --- 2. Lightbox View Navigation Logic ---

// Get all non-hidden image URLs from active dataset to update navigation sequences
function updateActiveImagePool() {
    activeImages = [];
    galleryItems.forEach(item => {
        if (item.style.display !== 'none') {
            const imgElement = item.querySelector('img');
            activeImages.push(imgElement.getAttribute('src'));
        }
    });
}

// Open Lightbox
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        updateActiveImagePool();
        const targetSrc = item.querySelector('img').getAttribute('src');
        currentImgIndex = activeImages.indexOf(targetSrc);
        
        lightboxImg.setAttribute('src', targetSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Freeze background scrolling
    });
});

// Cycle Image (Direction: 1 for next, -1 for previous)
function navigateLightbox(direction) {
    currentImgIndex += direction;
    
    // Boundary Wrapping Checks
    if (currentImgIndex >= activeImages.length) currentImgIndex = 0;
    if (currentImgIndex < 0) currentImgIndex = activeImages.length - 1;
    
    lightboxImg.setAttribute('src', activeImages[currentImgIndex]);
}

// Close Lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable window scroll operations
}

// Attach Lightbox Actions
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', closeLightbox); // Close if user clicks outside background wrapper

// Keyboard Accessibility Mapping
window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') navigateLightbox(1);
    else if (e.key === 'ArrowLeft') navigateLightbox(-1);
    else if (e.key === 'Escape') closeLightbox();
});