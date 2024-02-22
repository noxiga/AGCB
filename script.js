const nouveauLink = document.getElementById("newLink");
const sauvegarderLink = document.getElementById("saveLink");
const fileInput = document.getElementById("fileInput");
const fileForm = document.getElementById("fileForm");
const recentDocumentsList = document.getElementById("recentDocuments");
const saveLink = document.getElementById("saveLink");

nouveauLink.addEventListener("click", function(event) {
    event.preventDefault();
    
    // Demander à l'utilisateur d'entrer le nom du fichier
    const fileName = prompt("Entrez le nom du nouveau fichier :");

    if (fileName) { // Vérifier si un nom de fichier a été saisi
        // Ouvrir une nouvelle fenêtre ou un nouvel onglet
        const newWindow = window.open("", "_blank");

        // Contenu de la nouvelle fenêtre
        newWindow.document.write("<h1>"+ fileName +"</h1>");
        newWindow.document.write("<button id='saveButton'>Sauvegarder</button>");
        newWindow.document.write("<button onclick='window.close()'>Fermer</button>");
        
        // Ajouter un gestionnaire d'événements pour le bouton "Sauvegarder"
        newWindow.document.getElementById("saveButton").addEventListener("click", function() {
            const htmlContent = newWindow.document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], { type: "text/html" });
            const url = URL.createObjectURL(blob);
        
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName+".html";
            link.click();
        
            // Libérer l'URL après le téléchargement
            URL.revokeObjectURL(url);

            // Enregistrement du document dans le localStorage avec le nom de fichier
            localStorage.setItem(fileName, htmlContent);
            
            // Afficher les derniers documents
            displayRecentDocuments();
        });
    }
});

fileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        const fileReader = new FileReader();

        fileReader.onload = function(event) {
            const fileContent = event.target.result;
            const newWindow = window.open("", "_blank");

            // Afficher le contenu du fichier dans la nouvelle fenêtre
            newWindow.document.write(fileContent);
        };

        fileReader.readAsText(selectedFile);
    }
});

// Au moment de sauvegarder un document
saveLink.addEventListener("click", function() {
    const htmlContent = document.documentElement.outerHTML;
    const fileName = "Document " + (localStorage.length + 1);

    // Enregistrement du document dans le localStorage avec le nom de fichier
    localStorage.setItem(fileName, htmlContent);
    
    // Afficher les derniers documents
    displayRecentDocuments();
});

// Fonction pour afficher les derniers documents
function displayRecentDocuments() {
    recentDocumentsList.innerHTML = ""; // Effacer la liste actuelle
    
    // Récupérer les noms des cinq derniers fichiers du localStorage
    const fileNames = Object.keys(localStorage).slice(-5);
    
    fileNames.forEach(fileName => {
        const listItem = document.createElement("li");
        const openLink = document.createElement("a");
        
        openLink.textContent = fileName;
        openLink.href = "#";
        
        openLink.addEventListener("click", function() {
            const fileContent = localStorage.getItem(fileName);
            const newWindow = window.open("", "_blank");
            newWindow.document.write(fileContent);
        });
        
        listItem.appendChild(openLink);
        recentDocumentsList.appendChild(listItem);
    });
}

// Afficher les documents récemment ouverts lors du chargement initial
displayRecentDocuments();
