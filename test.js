import chai from 'chai'
import fs from 'fs'
const expect = chai.expect

it('loads test.dat', function(done) {
    System.import('test.dat!raw').then(function(data) {
        expect(data).deep.equal(new Uint8Array(fs.readFileSync('./test.dat')))
    }).then(done, done)
})
