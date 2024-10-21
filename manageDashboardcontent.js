function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('#toggleSidebar');
    const sidebarButtons = sidebar.querySelectorAll('button');

    if (toggleButton) {  // Check if the toggle button exists
        // Toggle sidebar visibility when the toggle button is clicked
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    } else {
        console.error('Toggle button not found');
    }

    // Add event listeners to sidebar buttons to collapse sidebar when any of them is clicked
    sidebarButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            sidebar.classList.remove('active'); // Collapse the sidebar
        });
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

