document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    const contentSections = {
        'default': document.getElementById('defaultContent'),
        'countries': document.getElementById('countriesContent'),
        'companies': document.getElementById('companiesContent')
    };

    menuButton.addEventListener('click', () => menuDropdown.classList.toggle('hidden'));

    // Dynamische Anpassung des Menüs je nach Schreibrichtung
    document.querySelector('nav').style.float = document.documentElement.getAttribute('dir') === 'rtl' ? 'left' : 'right';

    // Funktion zur Anzeige der dynamischen Inhalte
    window.showContent = (contentId) => {
        Object.values(contentSections).forEach(section => section.classList.add('hidden'));
        contentSections[contentId].classList.remove('hidden');
    };

    // Funktion zum Filtern der Tabelle
    window.filterTable = () => {
        const filters = ['filterCountry', 'filterCompany', 'filterEmissions'].map(id => sanitizeInput(document.getElementById(id).value.toUpperCase()));
        document.querySelectorAll('#emissionsTable tr').forEach(row => {
            const [country, company, emissions] = Array.from(row.cells).map(cell => cell.textContent.toUpperCase());
            row.style.display = filters.every((filter, index) => !filter || [country, company, emissions][index].includes(filter)) ? '' : 'none';
        });
    };

    // Funktion zur Desinfektion von Benutzereingaben
    const sanitizeInput = (input) => {
        const element = document.createElement('div');
        element.textContent = input;
        return element.innerHTML;
    };

    // Funktion zum Sortieren der Tabelle
    window.sortTable = (columnIndex, order) => {
        const table = document.getElementById('emissionsTable');
        const rows = Array.from(table.rows).slice(1); // Exclude header row
        const multiplier = order === 'asc' ? 1 : -1;

        rows.sort((a, b) => {
            const [cellA, cellB] = [a.cells[columnIndex].textContent.trim(), b.cells[columnIndex].textContent.trim()];
            return !isNaN(cellA) && !isNaN(cellB)
                ? multiplier * (cellA - cellB)
                : multiplier * cellA.localeCompare(cellB);
        });

        rows.forEach(row => table.appendChild(row)); // Re-attach sorted rows
    };
});
