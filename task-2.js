const fs = require('fs');
const lineReader = require('line-reader');
const AdmZip = require('adm-zip');

const zip = new AdmZip('examples.zip');
const zipEntries = zip.getEntries();

const desktopPhonesPath = 'C:\\Users\\saten\\OneDrive\\Desktop\\phones.txt';
const desktopEmailsPath = 'C:\\Users\\saten\\OneDrive\\Desktop\\emails.txt';

const writeDataIntoFile = (outPutFile, outPutData) => {
    try {
        let finalData = '';
        outPutData.forEach((data, index) => {
            if (index !== outPutData.length -1) {
                finalData += `${data}\n`;
            } else {
                finalData += `${data}`;
            }
        })

        fs.appendFileSync(outPutFile, finalData, (err) => {
            if (err) {
                console.log(err, "error while saving data");
            } else {
                console.log("The data has been saved in the file");
            }
        });
        process.exit(0);
    } catch (e) {
        console.log(e, "error in writing data into file");
    }
}

const formatPhoneNumbers = (data) => {
    let telNumber = data.replace(/ /g, '');
    telNumber = telNumber.replace(/\t/g, '');
    telNumber = telNumber.replace(/-/g, '');
    telNumber = telNumber.replace(/[\[\]&]+/g, '');
    let formattedPhoneNumber = '';
    if (telNumber.length > 0) {
        [...telNumber].forEach(tel => {
            if (/^-?\d+$/.test(tel) || ['+', '(', ')'].includes(tel)) {
                formattedPhoneNumber += tel;
                formattedPhoneNumber = formattedPhoneNumber.replace((101), (401));
                formattedPhoneNumber = formattedPhoneNumber.replace((202), (802));
                formattedPhoneNumber = formattedPhoneNumber.replace((301), (321));
            }
        })
    }
    return formattedPhoneNumber;
}

const formatEmails = (line, inputData) => {
    let data = line.substring(line.indexOf('@') + 1);
    let reversedString = inputData[0].split('').reverse().join('');
    let firstPart = reversedString.split(' ')[0].split('').reverse().join('');

    return `${firstPart}@${data}`;
}

const getSplitCharacter = (str) => {
    const separators = [',', ':', '\t', ' '];
    return separators.find(separator => str.indexOf(separator) !== 1);
};

const filterEmails = (emails) => {
    emails = emails.filter(email => {
        if (email.split('.').pop() === 'org') {
            return email;
        }
    });
    emails = emails.map(email => {
        return email.replace(/ /g, '').replace(/\t/g, '');
    });

    return [...new Set(emails)].sort();
}

zipEntries.forEach((zipEntry) => {
    let uniqueNumbers = [];
    let uniqueEmails = [];

    let filename = '';
    let ext = '';
    if (!zipEntry.isDirectory) {
        filename = zipEntry.entryName;
        ext = filename.split('.').pop();
        if (ext === 'txt') {

            zip.extractEntryTo(zipEntry, 'examples', false, true);
            lineReader.open(`examples/${filename}`, (err, reader) => {
                let phoneNumbers = [];
                let emails = [];

                while (reader.hasNextLine()) {
                    reader.nextLine((err, line) => {
                        let inputData = line.split('@');
                        let formattedPhoneNumber = '';
                        let formattedEmailData = '';
                        formattedPhoneNumber = formatPhoneNumbers(inputData[0]);
                        formattedEmailData = formatEmails(line, inputData);
                        let splitter = getSplitCharacter(formattedEmailData);
                        formattedEmailData = formattedEmailData.split(splitter);
                        if (formattedPhoneNumber.length > 0) {
                            phoneNumbers = [
                                ...phoneNumbers,
                                formattedPhoneNumber
                            ]
                        }
                        if (formattedEmailData.length > 0 && formattedEmailData[0] !== '') {
                            emails = [
                                ...emails,
                                ...formattedEmailData
                            ]
                        }

                    });
                }
                uniqueEmails = [
                    ...[],
                    ...filterEmails(emails)
                ];
                uniqueNumbers = [
                    ...uniqueNumbers,
                    ...[...new Set(phoneNumbers)].sort()
                ];

                writeDataIntoFile(desktopPhonesPath, uniqueNumbers);
                writeDataIntoFile(desktopEmailsPath, uniqueEmails);
            });
        }
    }
});
