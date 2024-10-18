function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

toggleSidebar.addEventListener("click", () => {
    if (sidebar.style.width === "250px" || sidebar.style.width === "") {
        sidebar.style.width = "0";
        mainContent.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        mainContent.style.marginLeft = "250px";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('#toggleSidebar');

    // Toggle sidebar visibility when the button is clicked
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Make the toggle button draggable
    let isDragging = false;
    let offsetX, offsetY;

    toggleButton.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - toggleButton.getBoundingClientRect().left;
        offsetY = e.clientY - toggleButton.getBoundingClientRect().top;
        toggleButton.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            toggleButton.style.left = `${x}px`;
            toggleButton.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            toggleButton.style.cursor = 'grab';
        }
    });
});
