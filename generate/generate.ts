import * as fs from 'fs'
import * as path from 'path'
import * as co from 'co'
import * as chalk from 'chalk'
import {createLocation} from '../helpers/helpers'
import {items} from './items'
import {createFile, promiseFsReadFile, promiseFsWriteFile} from '../helpers/filer'

export default function generate(item: string, type: number, doInject: boolean, lineNumber?: number, location?: string) {
    return new Promise((resolve, reject) => {

        let styleLoc = createLocation(['assets', 'css', items[item].fileName], items[item].fileName);

        createFile(items[item].types[type].css, styleLoc, 'css')
            .catch(err => reject(err))
            .then(val => tryInject(val))
            .catch(err => reject(err))
            .then(res => resolve(res));
    });


    function tryInject(value) {
        return new Promise((resolve, reject) => {
            if (!doInject) return resolve(value);

            co(function *() {
                let data;

                try {
                    console.log(location);
                    data = yield promiseFsReadFile(location)
                } catch (err) {
                    throw err;
                }

                data = data.toString().split('\n');
                data.splice(lineNumber, 0, items[item].types[type].html);
                
                let full = data.join('\n');

                console.log(full);

                return yield promiseFsWriteFile(location, full)
            })
                .then(res => resolve(value))
                .catch(err => reject(err))
        })
    }
}