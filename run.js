// run.js
import {
    addRowButton,
    addColButton,
    deleteRowButton,
    deleteColButton,
    checkOneRequest,
    checkMultiRequest,
    requestDiv,
    divMultiRequest,
    maxHeader,
    selectbox,
    data,
    rightContainer,
    initRequestInputs,
    addRow,
    addCol,
    deleteRow,
    deleteCol,
} from './hdh.js';

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
            divMultiRequest.style.display = 'none';
            maxHeader.textContent = 'Request';
        }
    });

    addRowButton.addEventListener('click', () => {
        addRow();
    });

    addColButton.addEventListener('click', () => {
        addCol();
    });

    deleteRowButton.addEventListener('click', () => {
        deleteRow();
    });

    deleteColButton.addEventListener('click', () => {
        deleteCol();
    });

    const runAlgorithmButton = document.getElementById('run_algorithm');

    runAlgorithmButton.addEventListener('click', function () {
        // Khai báo các biến toàn cục
        let max;
        let allocation;
        let available;
        let selectedProcessIndex;
        let selectedProcess;
        let requestInputs;
        let requestValues;
        let work = [];
        let need;
        let safeSequence = [];

        // Giả sử data là một mảng các đối tượng chứa max, allocation và available
        max = data.map(row => row.max);
        allocation = data.map(row => row.allocation);
        // Chuyển available thành mảng một chiều và loại bỏ các giá trị undefined
        available = data.flatMap(row => row.available || []).filter(value => value !== undefined);

        selectedProcessIndex = selectbox.selectedIndex;
        selectedProcess = selectbox.options[selectedProcessIndex].value;

        requestInputs = Array.from(document.querySelectorAll('#request_num input'));
        requestValues = requestInputs.map(input => Number(input.value)); // Đảm bảo các giá trị là số

        need = max.map((maxRow, i) => maxRow.map((maxVal, j) => maxVal - allocation[i][j]));
        rightContainer.innerHTML = "";

        if (checkOneRequest.checked) {
            if (!resourceAllocationAlgorithm())
                return;

            printSafeSequence(1);
            return;
        }

        if (checkMultiRequest.checked) {
            deadlockDetectionAlgorithm();
            printSafeSequence(0);
            return;
        }

        printSafeSequence(1);
        return;

        function lessOrEqual(a, b) {
            for (let i = 0; i < a.length; i++) {
                if (a[i] > b[i]) {
                    return false;
                }
            }
            return true;
        }

        function plusArray(a, b) {
            return a.map((value, index) => value + b[index]);
        }

        function minusArray(a, b) {
            return a.map((value, index) => value - b[index]);
        }

        function safetyStateCheckingAlgorithm() {
            const n = max.length;
            const m = available.length; // Điều chỉnh để lấy số lượng tài nguyên

            let finish = new Array(n).fill(false);

            // Sao chép sâu của available
            let localWork = [...available];
            work.push([...localWork]);

            while (true) {
                let found = false;
                for (let i = 0; i < n; i++) {
                    if (!finish[i] && lessOrEqual(need[i], localWork)) {
                        localWork = plusArray(localWork, allocation[i]);
                        work.push([...localWork]);
                        finish[i] = true;
                        safeSequence.push(`P${i + 1}`);
                        found = true;
                    }
                }
                if (!found) {
                    break;
                }
            }
            safeSequence = safeSequence.join(' - ');
            return finish.every(f => f);
        }

        function resourceAllocationAlgorithm() {
            let divPar = document.createElement('div');
            divPar.style.padding = "20px 0px 10px 0px";

            let codeHTML = "<p>GIẢI THUẬT CẤP PHÁT TÀI NGUYÊN</p>";
            divPar.innerHTML = codeHTML;
            rightContainer.appendChild(divPar);

            let P = `[P${parseInt(selectedProcess) + 1}]`;
            let needi = need[selectedProcess];
            let reqi = requestValues;

            divPar = document.createElement('div');
            divPar.style.padding = "20px 0px 0px 0px";
            codeHTML = "";

            if (lessOrEqual(reqi, needi)) {
                codeHTML += `<p>Request ${P} (${reqi}) <= Need ${P} (${needi}) : Thỏa mãn</p>`;

                if (lessOrEqual(requestValues, available)) {
                    codeHTML += `<p>Request ${P} (${reqi}) <= Available (${available}) : Thỏa mãn</p>`;
                } else {
                    codeHTML += `<p>Request ${P} (${reqi}) > Available (${available}) : Không thỏa mãn</p>`;
                    return false;
                }
            } else {
                codeHTML += `<p>Request ${P} (${reqi}) > Need ${P} (${needi}) : Không thỏa mãn</p>`;
                return false;
            }

            divPar.innerHTML = codeHTML;
            rightContainer.appendChild(divPar);

            assume();
            return true;
        }

        function deadlockDetectionAlgorithm() {
            let divPar = document.createElement('div');
            divPar.style.padding = "20px 0px 10px 0px";

            let codeHTML = "<p>GIẢI THUẬT PHÁT HIỆN DEADLOCK</p>";
            divPar.innerHTML = codeHTML;
            rightContainer.appendChild(divPar);

            need = [...max];
            console.log(need);
        }

        function assume() {
            let P = `[${parseInt(selectedProcess)}]`;
            let needi = need[selectedProcess];
            let reqi = requestValues;
            let allocationi = allocation[selectedProcess];

            let divPar = document.createElement('div');
            divPar.style.padding = "20px 0px 0px 0px";

            let codeHTML = "";

            codeHTML += `<p>Giả định:</p>`;
            codeHTML += `<p>available = available (${available}) - request ${P} (${reqi})</p>`;
            codeHTML += `<p>allocation ${P} = allocation ${P} (${allocationi}) + request ${P} (${reqi})</p>`;
            codeHTML += `<p>need ${P} = need ${P} (${needi}) - request ${P} (${reqi})</p>`;

            divPar.innerHTML = codeHTML;
            rightContainer.appendChild(divPar);

            available = minusArray(available, reqi);
            allocation[selectedProcess] = plusArray(allocationi, reqi);
            need[selectedProcess] = minusArray(needi, reqi);

            printAssume();
        }

        function printSafeSequence(signal) {
            const result = safetyStateCheckingAlgorithm();

            let divPar = document.createElement('div');
            divPar.style.padding = "20px 0px 10px 0px";

            let codeHTML = "<p>GIẢI THUẬT KIỂM TRA TRẠNG THÁI AN TOÀN </p>";
            divPar.innerHTML = codeHTML;
            rightContainer.appendChild(divPar);

            divPar = document.createElement('div');
            divPar.style.padding = "20px 0px 0px 0px";
            codeHTML = "";

            if (signal == 1)
                printNeedTable();
            printWorkTable();

            if (result) {
                codeHTML += `<p>Hệ thống đang ở trạng thái an toàn.</p>`;
                codeHTML += `<p>Chuỗi an toàn: ${safeSequence}</p>`;
            } else {
                codeHTML += `<p>Hệ thống không ở trạng thái an toàn.</p>`;
            }

            divPar.innerHTML = codeHTML;
            rightContainer.appendChild(divPar);
            return;
        }

        function printWorkTable() {
            let divContent = document.createElement('div');
            divContent.classList.add('content');
            divContent.style.padding = "15px 0px 20px 0px";

            let divHeading = document.createElement('div');
            divHeading.classList.add('heading_table_wrapper');

            let codeHTML =
                `
            <table>
            <tr>
                <th>
                    <div class="space">
                    </div>
                </th>
                <th>Work</th>
            </tr>
            <tr>
                <th>
                    <div class="space"></div>
                </th>
                <th>
                    <div class="allocation_row_title">
            `;

            for (let i = 0; i < work[0].length; i++) {
                codeHTML += `<p>R${i + 1}</p>`;
            }

            codeHTML +=
                `
                    </div>
                </th>
            </tr>
            </table>
            `;
            divHeading.innerHTML = codeHTML;
            divContent.appendChild(divHeading);

            codeHTML = "";
            let divData = document.createElement('div');
            divData.classList.add('data_table_wrapper');

            codeHTML =
                `
            <table>
            `;

            for (let i = 0; i < work.length; i++) {
                codeHTML += `<tr>
                                <th>
                                    <input class="name_process" value="${`P${i + 1}`}" readonly tabindex="-1">
                                </th>
                                <th>
                                    <div class="allocation_row_data">
                            `;

                for (let j = 0; j < work[i].length; j++) {
                    codeHTML +=
                        `
                        <input type="number" class="input-number" value="${work[i][j]}" data-index="0" data-type="allocation" data-pos="${j}">
                    `;
                }
                codeHTML +=
                    `
                    </div>
                    </th>
                    </tr>
                `;
            }
            codeHTML +=
                `
            </table>
            `;
            divData.innerHTML = codeHTML;
            divContent.appendChild(divData);

            let divInput = document.createElement('div');
            divInput.classList.add('input');
            divInput.appendChild(divContent);
            rightContainer.appendChild(divInput);
        }
        function printNeedTable() {
            let divContent = document.createElement('div');
            divContent.classList.add('content');
            divContent.style.padding = "15px 0px 20px 0px";

            let divHeading = document.createElement('div');
            divHeading.classList.add('heading_table_wrapper');

            let codeHTML =
                `
            <table>
            <tr>
                <th>
                    <div class="space">
                    </div>
                </th>
                <th>Need</th>
            </tr>
            <tr>
                <th>
                    <div class="space"></div>
                </th>
                <th>
                    <div class="available_row_title">
            `;

            for (let i = 0; i < need[0].length; i++) {
                codeHTML += `<p>R${i + 1}</p>`;
            }

            codeHTML +=
                `
                    </div>
                </th>
            </tr>
            </table>
            `;
            divHeading.innerHTML = codeHTML;
            divContent.appendChild(divHeading);

            codeHTML = "";
            let divData = document.createElement('div');
            divData.classList.add('data_table_wrapper');

            codeHTML =
                `
            <table>
            `;

            for (let i = 0; i < need.length; i++) {
                codeHTML += `<tr>
                                <th>
                                    <input class="name_process" value="${`P${i + 1}`}" readonly tabindex="-1">
                                </th>
                                <th>
                                    <div class="available_row_data">
                            `;

                for (let j = 0; j < need[i].length; j++) {
                    codeHTML +=
                        `
                        <input type="number" class="input-number" value="${need[i][j]}" data-index="0" data-type="available" data-pos="${j}">
                    `;
                }
                codeHTML +=
                    `
                    </div>
                    </th>
                    </tr>
                `;
            }
            codeHTML +=
                `
            </table>
            `;
            divData.innerHTML = codeHTML;
            divContent.appendChild(divData);

            let divInput = document.createElement('div');
            divInput.classList.add('input');
            divInput.appendChild(divContent);
            rightContainer.appendChild(divInput);
        }
        function printAssume() {
            let divContent = document.createElement('div');
            divContent.classList.add('content');
            divContent.style.padding = "15px 0px 20px 0px";

            let divHeading = document.createElement('div');
            divHeading.classList.add('heading_table_wrapper');

            let codeHTML =
                `
            <table>
            <tr>
                <th>
                    <div class="space">
                    </div>
                </th>
                <th>Available</th>
                <th>Allocation</th>
                <th>Need</th>
            </tr>
            <tr>
                <th>
                    <div class="space"></div>
                </th>
                <th>
                    <div class="allocation_row_title">
            `;

            for (let i = 0; i < available.length; i++) {
                codeHTML += `<p>R${i + 1}</p>`;
            }

            codeHTML +=
                `
                    </div>
                </th>
                <th>
                    <div class="allocation_row_title">
            `;

            for (let i = 0; i < allocation[0].length; i++) {
                codeHTML += `<p>R${i + 1}</p>`;
            }

            codeHTML +=
                `
                    </div>
                </th>
                <th>
                    <div class="allocation_row_title">
            `;

            for (let i = 0; i < need[0].length; i++) {
                codeHTML += `<p>R${i + 1}</p>`;
            }

            codeHTML +=
                `
                    </div>
                </th>
            </tr>
            </table>
            `;
            divHeading.innerHTML = codeHTML;
            divContent.appendChild(divHeading);

            codeHTML = "";
            let divData = document.createElement('div');
            divData.classList.add('data_table_wrapper');

            codeHTML =
                `
            <table>
            `;

            for (let i = 0; i < allocation.length; i++) {
                codeHTML += `<tr>
                                <th>
                                    <input class="name_process" value="P${i + 1}" readonly tabindex="-1">
                                </th>
                                <th>
                                    <div class="allocation_row_data">
                            `;

                if (i === 0) {
                    for (let j = 0; j < available.length; j++) {
                        codeHTML +=
                            `
                            <input type="number" class="input-number" value="${available[j]}" data-index="0" data-type="available" data-pos="${j}">
                        `;
                    }
                } else {
                    for (let j = 0; j < available.length; j++) {
                        codeHTML += ``;
                    }
                }

                codeHTML +=
                    `
                    </div>
                    </th>
                    <th>
                        <div class="allocation_row_data">
                `;

                for (let j = 0; j < allocation[i].length; j++) {
                    codeHTML +=
                        `
                        <input type="number" class="input-number" value="${allocation[i][j]}" data-index="0" data-type="allocation" data-pos="${j}">
                    `;
                }
                codeHTML +=
                    `
                    </div>
                    </th>
                    <th>
                        <div class="allocation_row_data">
                `;

                for (let j = 0; j < need[i].length; j++) {
                    codeHTML +=
                        `
                        <input type="number" class="input-number" value="${need[i][j]}" data-index="0" data-type="need" data-pos="${j}">
                    `;
                }
                codeHTML +=
                    `
                    </div>
                    </th>
                    </tr>
                `;
            }
            codeHTML +=
                `
            </table>
            `;
            divData.innerHTML = codeHTML;
            divContent.appendChild(divData);

            let divInput = document.createElement('div');
            divInput.classList.add('input');
            divInput.appendChild(divContent);
            rightContainer.appendChild(divInput);
        }
    });
});
