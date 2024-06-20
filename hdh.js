// hdh.js
export const addRowButton = document.getElementById('add_row');
export const addColButton = document.getElementById('add_col');
export const deleteRowButton = document.getElementById('delete_row');
export const deleteColButton = document.getElementById('delete_col');
export const dataTable = document.getElementById('data_table');
export const selectbox = document.getElementById('mySelect');
export const checkOneRequest = document.getElementById('check_one_request');
export const checkMultiRequest = document.getElementById('check_multi_request');
export const divOneRequest = document.getElementById('divOneRequest');
export const divMultiRequest = document.getElementById('divMultiRequest');
export const requestDiv = document.getElementById('showOneRequest');
export const requestNumDiv = document.getElementById('request_num');
export const maxHeader = document.getElementById('max_multiRequest');
export const tableBody = dataTable;
export const data = [];
export const rightContainer = document.getElementById('right_container');

export function initRequestInputs() {
    const colCount = document.querySelector('.max_row_title').children.length;
    addRequestInputs(colCount);
    if (checkOneRequest.checked) {
        requestDiv.style.display = 'flex';
    } else {
        requestDiv.style.display = 'none';
    }
}

export function addRow() {
    const colCount = document.querySelector('.max_row_title').children.length;
    const max = new Array(colCount).fill(0);
    const allocation = new Array(colCount).fill(0);
    const newId = 'P' + (data.length + 1);
    const newRow = { id: newId, max: max, allocation: allocation };
    if (data.length === 0) {
        newRow.available = new Array(colCount).fill(0); // Only the first row will have available
    }
    data.push(newRow);
    addData();
    selectbox.selectedIndex = 0;
}

export function addData() {
    tableBody.innerHTML = '';
    selectbox.innerHTML = '';

    data.forEach((item, index) => {
        const row = createTableRow(item, index);
        tableBody.appendChild(row);
        const option = document.createElement('option');
        option.value = index;
        option.textContent = item.id;
        selectbox.appendChild(option);
    });

    document.querySelectorAll('.input-number').forEach(input => {
        input.addEventListener('input', (e) => {
            const i = e.target.dataset.index;
            const t = e.target.dataset.type;
            const p = e.target.dataset.pos;
            if (data[i] && data[i][t]) {
                data[i][t][p] = Number(e.target.value);
            }
        });
    });
}

export function createTableRow(item, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <th>
            <input class="name_process" value="${item.id}" readonly tabindex="-1">
        </th>
        <th>
            <div class="max_row_data">
                ${createInputs(item.max, index, 'max')}
            </div>
        </th>
        <th>
            <div class="allocation_row_data">
                ${createInputs(item.allocation, index, 'allocation')}
            </div>
        </th>
    `;
    if (item.available) {
        row.innerHTML += `
            <th>
                <div class="available_row_data">
                    ${createInputs(item.available, index, 'available')}
                </div>
            </th>
        `;
    }

    return row;
}

export function createInputs(values, index, type) {
    return values.map((value, pos) => {
        return `<input type="number" class="input-number" id="${type}-${index}-${pos}" value="${value !== undefined ? value : 0}" data-index="${index}" data-type="${type}" data-pos="${pos}">`;
    }).join('');
}

export function addCol() {
    const colIndex = document.querySelector('.max_row_title').children.length + 1;

    // Add to heading_table
    const maxHeader = document.querySelector('.max_row_title');
    const allocationHeader = document.querySelector('.allocation_row_title');
    const availableHeader = document.querySelector('.available_row_title');

    const maxHeaderCol = document.createElement('p');
    maxHeaderCol.textContent = `R${colIndex}`;
    maxHeader.appendChild(maxHeaderCol);

    const allocationHeaderCol = document.createElement('p');
    allocationHeaderCol.textContent = `R${colIndex}`;
    allocationHeader.appendChild(allocationHeaderCol);

    const availableHeaderCol = document.createElement('p');
    availableHeaderCol.textContent = `R${colIndex}`;
    availableHeader.appendChild(availableHeaderCol);

    // Add new inputs for each row in data_table
    data.forEach(row => {
        row.max.push(0);
        row.allocation.push(0);
        if (row.available) {
            row.available.push(0); // Only add available if it exists
        }
    });

    // Update request section with new inputs
    addRequestInputs(colIndex);

    addData();
}

export function deleteRow() {
    if (dataTable.rows.length > 0) {
        dataTable.deleteRow(-1);
        data.pop();
        selectbox.remove(selectbox.length - 1);
    }
}

export function deleteCol() {
    const colIndex = document.querySelector('.max_row_title').children.length;
    if (colIndex > 1) { // Avoid deleting initial columns
        // Remove from heading_table
        const maxHeader = document.querySelector('.max_row_title');
        const allocationHeader = document.querySelector('.allocation_row_title');
        const availableHeader = document.querySelector('.available_row_title');

        maxHeader.removeChild(maxHeader.lastElementChild);
        allocationHeader.removeChild(allocationHeader.lastElementChild);
        availableHeader.removeChild(availableHeader.lastElementChild);

        // Remove new inputs from each row in data_table
        data.forEach(row => {
            row.max.pop();
            row.allocation.pop();
            if (row.available) {
                row.available.pop(); // Only remove from available if it exists
            }
        });

        // Update request section
        addRequestInputs(colIndex - 1);

        addData();
    }
}

function addRequestInputs(colIndex) {
    // Clear current request inputs
    requestNumDiv.innerHTML = '';

    // Add new request inputs
    for (let i = 1; i <= colIndex; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.classList.add('input-number');
        input.value = 0;
        input.id = `request${i}`;
        requestNumDiv.appendChild(input);
        if (i < colIndex) {
            requestNumDiv.appendChild(document.createTextNode('|'));
        }
    }
}

