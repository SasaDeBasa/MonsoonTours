function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

// document.addEventListener('DOMContentLoaded', function() {
//     const sidebar = document.querySelector('.sidebar');
//     const toggleButton = document.querySelector('#toggleSidebar');
//     const pageContent = document.getElementById('pageContent');
//     const sidebarButtons = sidebar.querySelectorAll('button');

//     // Initially load the sidebar in the collapsed state
//     sidebar.classList.add('collapsed');
//     toggleButton.innerHTML = '&gt;'; // Initially set to expand

//     // Toggle sidebar visibility when the toggle button is clicked
//     toggleButton.addEventListener('click', () => {
//         sidebar.classList.toggle('collapsed');

//         // Toggle the button text from > to <
//         if (sidebar.classList.contains('collapsed')) {
//             toggleButton.innerHTML = '&gt;'; // Expand symbol
//         } else {
//             toggleButton.innerHTML = '&lt;'; // Collapse symbol
//         }
//     });

//     // Add event listeners to sidebar buttons to collapse the sidebar when any of them is clicked
//     sidebarButtons.forEach((btn) => {
//         btn.addEventListener('click', () => {
//             sidebar.classList.add('collapsed'); // Collapse the sidebar after a click
//             toggleButton.innerHTML = '&gt;'; // Set the button to show "expand" symbol after collapsing
//         });
//     });
// });



