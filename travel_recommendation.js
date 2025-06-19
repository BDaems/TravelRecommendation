/* Search listeners */
document.getElementById("searchButton").addEventListener("click", function() {
    searchRecommendations(); // debuglogging in searchRecommendation
});

document.getElementById("resetButton").addEventListener("click", function() {
    document.getElementById("searchInput").value = "";
});

function searchRecommendations() {
    fetch('data/travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        let query = document.getElementById('searchInput').value.toLowerCase();
        localStorage.setItem('lastSearch', query);
        let results = data.filter(item => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query));
        document.getElementById('results').innerHTML = results.length 
            ? results.map(item => `<p><strong>${item.title}</strong>: ${item.content}</p>`).join('')
            : "<p>No results found.</p>";
    })
    .catch(error => console.error("Error fetching data:", error)); // Logs errors
}

// Auto-load last search query
document.getElementById('searchInput').value = localStorage.getItem('lastSearch') || "";

/* Navigation between sections */
function showSection(sectionId) {
    // Hide all sections first
    document.getElementById("sct-home").classList.add("hidden");
    document.getElementById("sct-about").classList.add("hidden");
    document.getElementById("sct-contact").classList.add("hidden");
    document.getElementById("sct-recom").classList.add("hidden");

    // Show the clicked section
    document.getElementById(sectionId).classList.remove("hidden");
}

// Add event listeners for navigation clicks
document.getElementById("home").addEventListener("click", function() {
    showSection("sct-home");
});
document.getElementById("aboutus").addEventListener("click", function() {
    showSection("sct-about");
});
document.getElementById("contactus").addEventListener("click", function() {
    showSection("sct-contact");
});

