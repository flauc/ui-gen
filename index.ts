#!/usr/bin/env node

const args = process.argv.slice(2);

// Handling functions
function handleErr(err): void {
    console.error('error: ', err);
    process.exit(0)
}

function handleRes(res): void {
    console.log(res);
    process.exit(1)
}

function onCall(args: string[]): void {

    switch (args[0]) {
        case 'c':
        case 'generate':

            let location = args.indexOf('-l') > -1 || args.indexOf('-location'),
                itemRegEx = new RegExp('^((header)|(h)|(footer)|(f))$', 'i'),
                validItem = itemRegEx.test(args[1]);

            if (!validItem) return handleErr('That type was not recognised.');
            if (!location) return handleErr('No location provided.');

            // Check if we should inject in to html
            let toInject = args.indexOf('-i') > -1 || args.indexOf('-inject') > -1;

            generate(args[1], location, toInject)
                .catch(err => handleErr(err))
                .then(val => handleRes(val));

            break;
    }
}