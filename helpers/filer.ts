import * as fs from 'fs'
import * as co from 'co'
import * as mkdirp from 'co-mkdirp'
import {stringMultiply} from './helpers'

// The directory where cmd is opened
const currentLocation = process.cwd();

/*
 Function createFile

 Creates the required file and all the folders if they don't exist already. 
 The function takes the following inputs: 

 file: string
 location: string
 type: string 
 */

export function createFile(file: string, location: string, type: string) {

    return new Promise((resolve, reject) => {
        let comp = location.split('/');

        // If the length is 1 then only the one file needs to be created
        if (comp.length === 1) {
            fs.writeFile(`${currentLocation}/${location}.${type}`, file,
                err => reject(err),
                () => resolve('Created successfully')
            );
        }

        else {

            let path = `${currentLocation}/`,
                fileName = `${comp[comp.length - 1]}.${type}`;

            // Add all of the other params to the path except for the last one which is the name of the file
            for (let i = 0; i < comp.length - 1; i++) path += `${comp[i]}/`;

            co(function* (){
                yield mkdirp(path);
            })
                .catch(err => console.log(err.stack))
                .then(() => {
                    fs.writeFile(`${currentLocation}/${location}.${type}`, file,
                        (err) => reject(err),
                        () => resolve('Created successfully')
                    )
                })
        }
    })
}

/*
 Function createTemplateStringFromObject

 Creates a properly indented template string from the passed object.
 This function is great for creating JSON files.
 */

let tabDepth = 0;

export function createTemplateStringFromObject(obj: Object): string  {
    tabDepth = 0;
    return buildObject(obj, true);
}

// Local functions
function buildObject(obj: Object, last: boolean): string {
    let keys = Object.keys(obj),
        toReturn = `{`,
        tab = `  `,
        end = `}`;

    if (Array.isArray(obj)) {
        toReturn = '[';
        end = ']';
        keys = [];

        for (let a = 0; a < obj.length; a++) keys.push(a);
    }

    // Increase the tab depth every time this function is called
    tabDepth += 1;

    // Set the end of the template string
    if (last) end = `\n${end}`;
    else if (keys.length > 0) end = `\n${stringMultiply(tab, tabDepth - 1) + end}`;

    keys.forEach((a, idx, array) => {
        toReturn += Array.isArray(obj) ? `\n${stringMultiply(tab, tabDepth)}${set(obj[a])}` : `\n${stringMultiply(tab, tabDepth)}'${a}': ${set(obj[a])}`;
        if (idx !== array.length - 1) toReturn += `,`
    });

    toReturn += end;

    return toReturn;
}

// Takes care of proper syntax when adding the value
function set(value: any): any {

    let toReturn;

    switch (typeof value) {
        case 'string':
            toReturn = `'${value}'`;
            break;
        case 'object':
            toReturn = buildObject(value, false);

            // Reduce the tab depth after the buildObject function was called
            // so that if we get to this point again the new object is aligned correctly
            tabDepth -= 1;
            break;
        default:
            toReturn = value;
            break;
    }

    return toReturn;
}

export function promiseFsReadFile(file: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, res) => {
            if (err) return reject(err);
            return resolve(res)
        })
    })
}

export function promiseFsWriteFile(file: string, text: string) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, text, (res, err) => {
            if (err) return reject(err);
            return resolve(res)
        })
    })
}