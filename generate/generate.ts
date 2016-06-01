import * as co from 'co'
import * as chalk from 'chalk'
import {createLocation} from '../helpers/helpers'
import {items} from './items'
import {createFile} from '../helpers/filer';

export default function generate(item: string, location: string, type: number, doInject: boolean) {
    return new Promise((resolve, reject) => {

        let styleLoc = createLocation(['assets', 'css', items[item].fileName], items[item].fileName);

        createFile(items[item].types[type].css, styleLoc, '.css')
            .catch(err => reject(err))
            .then(res => resolve(res));
    })
}