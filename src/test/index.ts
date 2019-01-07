import * as assert from 'assert'
import { readFileSync } from 'fs'
import { load, save } from '..'
import { writeAscii, readAscii } from '../util';
import { Lump, Wad } from '../types';

const testWadData = readFileSync( './src/test/fixtures/doomba.wad' )

describe( 'nwad', () => {
  it( 'loads a WAD', () => {
    const wad = load( testWadData )

    assert.strictEqual( wad.type, 'PWAD' )
    assert.strictEqual( wad.lumps.length, 11 )
  })

  it( 'saves a WAD', () => {
    const wad = load( testWadData )
    const outWadData = save( wad )

    assert.deepEqual( outWadData.buffer, testWadData.buffer )
  })

  it( 'ensures string length for lump names', () => {
    const lump: Lump = {
      name: 'GOODLUMP1',
      data: new Uint8Array([ 1, 2, 3 ])
    }

    const expect: Lump = {
      name: 'GOODLUMP',
      data: new Uint8Array( [ 1, 2, 3 ] )
    }

    const wad: Wad = {
      type: 'PWAD',
      lumps: [ lump ]
    }

    const wadData = save( wad )
    const outWad = load( wadData )

    assert.deepEqual( outWad.lumps[ 0 ], expect )
  })

  it( 'enforces valid lump names', () => {
    const lump: Lump = {
      name: 'bad lump name',
      data: new Uint8Array( [ 1, 2, 3 ] )
    }

    const wad: Wad = {
      type: 'PWAD',
      lumps: [ lump ]
    }

    assert.throws( () => save( wad ) )
  })
})
