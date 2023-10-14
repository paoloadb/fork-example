import { fork } from 'node:child_process'
import axios from 'axios'
// import {setTimeout} from 'node:timers/promises'
 
let child = fork('./fork.ts')
let ctr = 1

async function sendObjectForProcessing() {

    axios.get('https://random-data-api.com/api/v2/users')
        .then((response) => {
                child.connected ? child.send(JSON.stringify(response.data)) : process.exit(0)
        })
        .catch(err => console.log(err.message))


}

while (ctr <= 10) {
    sendObjectForProcessing()
    ctr ++
}

process.on('SIGINT', () => {
    child.disconnect()
    process.exit(0)
})

child.on('message', (message: object) => {
    console.log('Result: ', message)
    })
child.on('error', err => console.log(err.message))
child.on('disconnect', () => {
    console.log('Channel has disconnected')
})
child.on('spawn', () => console.log('spawning new child process...'))


