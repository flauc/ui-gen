import * as co from 'co'
import * as chalk from 'chalk'
import {createLocation} from '../helpers/helpers'
import {items} from './items'

export default function generate(item: string, location: string, type: number, doInject: boolean) {
    return new Promise((resolve, reject) => {

        let name = `_${items[item].types[type]}.scss`,
            scassLocation = createLocation(['assets', 'sass'], name);

        createFile(initialComponent, location, "ts")
            .catch(err => reject(err))
            .then(val => afterCreate(val, bootInject, serviceName, location, bootLocation))
            .catch(err => reject(err))
            .then(res => resolve(res));
    })
}