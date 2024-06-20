document.addEventListener('DOMContentLoaded', function () {
    const runAlgorithmButton = document.getElementById('run_algorithm');

    runAlgorithmButton.addEventListener('click', function () {
        // Khai báo các biến toàn cục------------------------------------------------------------------
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

        //------------------------------------------------------------------------------------------------

        if (checkOneRequest.checked) {
            resourceAllocationAlgorithm();
            return;
        }
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
                        safeSequence.push(`P${i}`);
                        found = true;
                    }
                }
                if (!found) {
                    break;
                }
            }

            return finish.every(f => f);
        }

        function resourceAllocationAlgorithm() {
            let P = `[P${parseInt(selectedProcess) + 1}]`;
            let needi = need[selectedProcess];
            let reqi = requestValues;

            if (lessOrEqual(reqi, needi)) {
                console.log(`Request ${P} (${reqi}) <= Need ${P} (${needi}) : Satisfy`);

                if (lessOrEqual(requestValues, available)) {
                    console.log(`Request ${P} (${reqi}) <= Available (${available}) : Satisfy`);
                }
                else {
                    console.log(`Request ${P} (${reqi}) > Available (${available}) : Unsatisfy`);
                    return;
                }
            }
            else {
                console.log(`Request ${P} (${reqi}) > Need ${P} (${needi}) : Unsatisfy`);
                return;
            }

            assume();
            
        }

        function assume() {
            let P = `[${parseInt(selectedProcess)}]`;
            let needi = need[selectedProcess];
            let reqi = requestValues;
            let allocationi = allocation[selectedProcess];

            console.log("Assume:");
            console.log(`available = available (${available}) - request ${P} (${reqi})`);
            console.log(`allocation ${P} = allocation ${P} (${allocationi}) + request ${P} (${reqi})`);            
            console.log(`need ${P} = need ${P} (${needi}) - request ${P} (${reqi})`);
            
            available = minusArray(available, reqi);
            allocation[selectedProcess] = plusArray(allocationi, reqi);
            need[selectedProcess] = minusArray(needi, reqi);
        }
    });
});
