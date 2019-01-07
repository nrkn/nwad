# nwad

Read/write WAD files, as used by Doom et al.

`npm install nwad`

## Usage

**NB**: All this module does is read from and write to the WAD data structure -
reading or creating the appropriate file header, indices etc. A WAD is just a
packed collection of "lumps" - to actually do anything interesting with the WAD
you will need to work with these lumps - [nlump](https://github.com/nrkn/nlump)
is underway, this module serves as a base for that one.

### nwad.load

Takes a Uint8Array and returns a WAD data structure:

```javascript
{
  "type": "", //"IWAD" or "PWAD"
  "lumps": [] //an array of lumps, as below
}
```

The lump structure:

```javascript
{
  "name": "",  //name as per the WAD info table
  "data": [] //a Uint8Array containing the lump data
}
```

Example:

```javascript
const fs = require( 'fs' )
const nwad = require( 'nwad' )

fs.readFile( 'doom.wad', ( err, buffer ) => {
  if( err ) throw err

  const wad = nwad.load( buffer )

  console.log( wad.type, wad.lumps.length )
})
```

### nwad.save

Takes a WAD data structure (as above) and returns a buffer:

```javascript
const fs = require( 'fs' )
const nwad = require( 'nwad' )
const getLumps = require( './some-module-for-getting-lumps-from-somewhere' )

const wadBuffer = nwad.save({
  type: 'PWAD',
  lumps: getLumps()
})

fs.writeFile( 'my.wad', wadBuffer, err => {
  if( err ) throw err
})
```

## license

MIT License

Copyright (c) 2019 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.