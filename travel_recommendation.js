/* Search listeners */
document.getElementById("searchButton").addEventListener("click", function() {
    alert("Searching for: " + document.getElementById("search").value);
  // alert to be replaced by SearchRecommendations 
});
document.getElementById("resetButton").addEventListener("click", function() {
    document.getElementById("search").value = "";
});

function searchRecommendations() {
    fetch('data/info.json')
        .then(response => response.json())
        .then(data => {
            let query = document.getElementById('searchInput').value.toLowerCase();
            localStorage.setItem('lastSearch', query);  // Store for persistence

            let results = data.filter(item => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query));
            document.getElementById('results').innerHTML = results.length 
                ? results.map(item => `<p><strong>${item.title}</strong>: ${item.content}</p>`).join('')
                : "<p>No results found.</p>";
        });
}

// Auto-load last search query
document.getElementById('searchInput').value = localStorage.getItem('lastSearch') || "";
/* section display */
function showSection(section) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');
}

/* Navigation in sections */
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Remove 'active' class from all sections
        document.querySelectorAll("section").forEach(section => {
            section.classList.remove("active");
        });

        // Add 'active' class to the clicked section
        const targetId = this.getAttribute("href").substring(1); // Get section ID
        document.getElementById(targetId).classList.add("active");
    });
});

