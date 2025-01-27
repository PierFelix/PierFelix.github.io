/**
 * Creates a table with the specified number of rows and columns.
 * @param {number} rows - The number of rows in the table.
 * @param {number} columns - The number of columns in the table.
 * @returns {void}
 */
function tableCreate(rows, columns) {
    // Clear the existing table if any
    const circleGrid = document.getElementById("circleGrid");
    if (!circleGrid) {
        console.error('Element with id "circleGrid" not found.');
        return;
    }
    circleGrid.innerHTML = "";

    // Create a new table
    const fragment = document.createDocumentFragment();
    const tbl = document.createElement('table');
    const squares = [];

    for (let i = 0; i < rows; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < columns; j++) {
            const td = tr.insertCell();
            const div = document.createElement('div');
            div.classList.add('square');
            div.id = `${i}-${j}`;
            squares.push(div);
            td.appendChild(div);
        }
    }

    fragment.appendChild(tbl);
    circleGrid.appendChild(fragment);

    // Apply styles in bulk
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode('.square{background-color: lightgray;}'));
    document.head.appendChild(style);
}

/**
 * Creates a table with the specified number of rows and columns.
 * @param {number} defaultRows - The number of rows in the table if none in url.
 * @param {number} defaultColumns - The number of columns in the table if none in url.
 * @returns {void}
 */
function initTableCreate(defaultRows, defaultColumns) {
    const urlParams = new URLSearchParams(window.location.search);
    const rows = parseInt(urlParams.get('rows')) || defaultRows;
    const columns = parseInt(urlParams.get('columns')) || defaultColumns;

    insertParam([`rows=${rows}`, `columns=${columns}`]);
    
    document.getElementById("rowsInput").value = rows;
    document.getElementById("columnsInput").value = columns;

    tableCreate(rows, columns);
}

/**
 * Updates the table based on the number of rows and columns input by the user.
 * Retrieves the values from the input fields with IDs "rowsInput" and "columnsInput",
 * parses them as integers, and then calls the tableCreate function with these values.
 * @returns {void}
 */
function updateTable() {
    const rows = parseInt(document.getElementById("rowsInput").value);
    const columns = parseInt(document.getElementById("columnsInput").value);
    insertParam([`rows=${rows}`, `columns=${columns}`]);
    tableCreate(rows, columns);
}


/**
 * Inserts or updates a query parameter in the URL.
 *
 * @param {list[string]} key - The key of the query parameter to insert or update.
 * @param {boolean} doReturn - If the params should be returned.
 * @returns {void}
 */
function insertParam(key, doReturn=false) {
    // kvp looks like ['key1=value1', 'key2=value2', ...]
    var kvp = document.location.search.substring(1).split('&');
    
    let i=0;
    let j=0;

    let encKey = '';
    let encValue = '';

    for(; i<key.length; i++){
        [encKey, encValue] = key[i].split('=');
        encKey = encodeURIComponent(encKey);
        encValue = encodeURIComponent(encValue);
        for(; j<kvp.length; j++){
            if (kvp[j].startsWith(encKey + '=')) {
                let pair = kvp[j].split('=');
                pair[1] = encValue;
                kvp[j] = pair.join('=');
                break;
            }
        }

        if(j >= kvp.length){
            kvp[kvp.length] = [encKey,encValue].join('=');
        }
    }

    // can return this or...
    let params = kvp.join('&');

    // update URL without reloading the page
    const newUrl = `${window.location.pathname}?${params}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (doReturn){
        return params;
    }
}
