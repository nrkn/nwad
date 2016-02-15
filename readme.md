# nwad

Read/write WAD files, as used by Doom et al.

`npm install nwad`

## Usage

**NB**: All this module does is read from and write to the WAD data structure - 
reading or creating the appropriate file header, indices etc. A WAD is just a 
packed collection of "lumps" - to actually do anything interesting with the WAD 
you will need to work with these lumps - a package to do that is underway, this 
module serves as a base for that one.

### nwad.load 

Takes a buffer and returns a WAD data structure:

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
  "data": null //a node.js Buffer containing the lump data
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