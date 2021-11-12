// Calculator
const lineReader = require('line-reader');
const fs = require('fs');

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the string ', (input) => {
    let inputData = input.split(' ');
    if (inputData.length === 3) {
        handleCalcWithFiles(inputData[1], inputData[2]);
    } else {
        handleCalcWithInputOutPut();
    }
});

rl.on('close', () => {
    process.exit(0);
});

// Option 1
const handleCalcWithInputOutPut = () => {
    let result = '';
    try {
        rl.question('>', (expression) => {
            if (/^([-+/*]\d+(\.\d+)?)*/.test(expression)) {
                try {
                    result = eval(expression);
                } catch (e) {
                    console.log("Invalid expression, try again!");
                    handleCalcWithInputOutPut()
                }
                console.log(result);
                if (!isNaN(result)) {
                    handleCalcWithInputOutPut();
                }
            }
            // rl.close();
        });
    } catch (e) {
        console.log("Invalid expression, try again!");
        handleCalcWithInputOutPut();
    }
}

// Option 2
const handleCalcWithFiles = (inputFile, outPutFile) => {
    let outPutData = '';
    try {
        lineReader.open(inputFile, (err, reader) => {
            while (reader.hasNextLine()) {
                let result = '';
                reader.nextLine((err, expression) => {
                    if (expression.charAt(0) !== '#') {
                        try {
                            result = eval(expression);
                        } catch (e) {
                        }
                        if (!isNaN(result)) {
                            result += '\n';
                            outPutData += result;
                        }
                    }
                });
            }
            if (outPutData) {
                writeDataIntoFile(outPutFile, outPutData);
            }
        });
    } catch (e) {
        console.log(e, "error in handleCalcWithFiles function");
    }
}

const writeDataIntoFile = (outPutFile, outPutData) => {
    try {
        outPutData = outPutData.replace(/\n*$/, '');
        fs.writeFile(outPutFile, outPutData, (err) => {
            if (err) {
                console.log(err, "error while saving data");
            } else {
                console.log("The data has been saved in the file");
                rl.close();
                process.exit(0);
            }
        });
    } catch (e) {
        console.log(e, "error in writing data into file");
    }
}