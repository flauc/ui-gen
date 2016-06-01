#!/usr/bin/env node
import * as chalk from 'chalk'
import generate from './generate/generate'

const args = process.argv.slice(2);

// Handling functions
function handleErr(err): void {
    console.error(chalk.red(`error: ${err}`));
    process.exit(0)
}

function handleRes(res): void {
    console.log(chalk.green(res));
    process.exit(1)
}

function onCall(args: string[]): void {

    switch (args[0]) {
        case 'g':
        case 'generate':

            let hasInject = args.indexOf('-i') > -1 ? args.indexOf('-i') : args.indexOf('-inject') > -1 ? args.indexOf('-inject') : null,
                doInject = false,
                lineNumber = 0,
                location;

            if (hasInject) {
                lineNumber = parseInt(args[hasInject + 1]);
                location = args.indexOf('-l') > -1 ? args.indexOf('-l') : args.indexOf('-location') > -1 ? args.indexOf('-location') : null;
                
                if (!location) return handleErr('There has to be a location is there is an inject.');
                
                location = args[location + 1];
                doInject = true;
            }
            
            

            let itemRegEx = new RegExp('^((header)|(footer))$', 'i'),
                validItem = itemRegEx.test(args[1]);

            if (!validItem) return handleErr('That item was not recognised.');
            
            let type = args.indexOf('-t') > -1 ? args.indexOf('-t') : args.indexOf('-type') > -1 ? args.indexOf('-type') : null,
                typeIndex = 1;

            if (type) typeIndex = parseInt(args[type + 1]);

            generate(args[1], typeIndex, doInject, lineNumber, location)
                .catch(err => handleErr(err))
                .then(val => handleRes(val));

            break;
    }
}

onCall(args);