const addRowButton = document.getElementById('add_row');
const addColButton = document.getElementById('add_col');
const deleteRowButton = document.getElementById('delete_row');
const deleteColButton = document.getElementById('delete_col');
const dataTable = document.getElementById('data_table');
const selectbox = document.getElementById('mySelect');
const checkOneRequest = document.getElementById('check_one_request');
const checkMultiRequest = document.getElementById('check_multi_request');
const divOneRequest = document.getElementById('divOneRequest');
const divMultiRequest = document.getElementById('divMultiRequest');
const requestDiv = document.getElementById('showOneRequest');
const requestNumDiv = document.getElementById('request_num');
const maxHeader = document.getElementById('max_multiRequest');
const tableBody = dataTable;
const data = [];

document.addEventListener('DOMContentLoaded', function () {
    initRequestInputs();

    checkOneRequest.addEventListener('change', () => {
        if (checkOneRequest.checked) {
            requestDiv.style.display = 'flex';
            divMultiRequest.style.display = 'none';
            maxHeader.textContent = 'Max';
        }
    });

    checkMultiRequest.addEventListener('change', () => {
        if (checkMultiRequest.checked) {
            requestDiv.style.display = 'none';
            divOneRequest.style.display = 'none';
            maxHeader.textContent = 'Request';
        }
    });

    addRowButton.addEventListener('click', () => {
        addRow();
        addData();
        selectbox.selectedIndex = 0;
    });

    function addRow() {
        const colCount = document.querySelector('.max_row_title').children.length;
        const max = new Array(colCount).fill(0);
        const allocation = new Array(colCount).fill(0);
        const newId = 'P' + (data.length + 1);
        const newRow = { id: newId, max: max, allocation: allocation };
        if (data.length === 0) {
            newRow.available = new Array(colCount).fill(0); // Only the first row will have available
        }
        data.push(newRow);
    }

    function addData() {
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

    function createTableRow(item, index) {
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

    function createInputs(values, index, type) {
        return values.map((value, pos) => {
            return `<input type="number" class="input-number" id="${type}-${index}-${pos}" value="${value !== undefined ? value : 0}" data-index="${index}" data-type="${type}" data-pos="${pos}">`;
        }).join('');
    }

    function removeRow(index) {
        data.splice(index, 1);
        addData();
    }

    addColButton.addEventListener('click', function () {
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
    });

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

    function initRequestInputs() {
        const colCount = document.querySelector('.max_row_title').children.length;
        addRequestInputs(colCount);
        if (checkOneRequest.checked) {
            requestDiv.style.display = 'flex';
        } else {
            requestDiv.style.display = 'none';
        }
    }

    deleteRowButton.addEventListener('click', function () {
        if (dataTable.rows.length > 0) {
            dataTable.deleteRow(-1);
            data.pop();
            selectbox.remove(selectbox.length - 1);
        }
    });

    deleteColButton.addEventListener('click', function () {
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
    });
});
