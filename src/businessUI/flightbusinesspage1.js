document.getElementById('searchFlight').addEventListener('keyup', function() {
    var searchValue = this.value.toLowerCase();
    var rows = document.querySelectorAll('#flightTableBody tr');
    
    rows.forEach(function(row) {
        var flightID = row.querySelector('td').textContent.toLowerCase();
        if (flightID.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
