#!/usr/bin/env node
import * as chalk from "chalk"
import generate from './generate/generate';

const args = process.argv.slice(2);

// Handling functions
function handleErr(err): void {
    console.error('error: ', err);
    console.error(chalk.red(`error: ${err}`));
    process.exit(0)
}

function handleRes(res): void {
    console.log(chalk.green(res));
    process.exit(1)
}

function onCall(args: string[]): void {

    switch (args[0]) {
        case 'c':
        case 'generate':

            let location = args.indexOf('-l') > -1 || args.indexOf('-location'),
                itemRegEx = new RegExp('^((header)|(h)|(footer)|(f))$', 'i'),
                validItem = itemRegEx.test(args[1]);

            if (!validItem) return handleErr('That item was not recognised.');
            if (!location) return handleErr('No location provided.');

            // Check if we should inject in to html
            let doInject = args.indexOf('-i') > -1 || args.indexOf('-inject') > -1;

            generate(args[1], location, doInject)
                .catch(err => handleErr(err))
                .then(val => handleRes(val));

            break;
    }
}