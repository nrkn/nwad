'use strict'

const getHeader = wadBuffer => {
  const typeId = wadBuffer.toString( 'ascii', 0, 4 )
  const numberOfLumps = wadBuffer.readInt32LE( 4 )
  const infoTableOffset = wadBuffer.readInt32LE( 8 )
  
  return {
    typeId,
    numberOfLumps,
    infoTableOffset
  }
}

const getInfo = ( wadBuffer, offset, i ) => {
  const id = i
  const filePosition = wadBuffer.readInt32LE( offset )
  const size = wadBuffer.readInt32LE( offset + 4 )
  const name = wadBuffer.toString( 'ascii', offset + 8, offset + 16 ).replace( /\0/g, '' )
  
  return {
    id,
    filePosition,
    size,
    name
  }
}

const getInfoTable = ( wadBuffer, header ) => {
  const infoTable = []
  
  for( var i = 0; i < header.numberOfLumps; i++ ){
    let offset = 16 * i + header.infoTableOffset
    infoTable.push( getInfo( wadBuffer, offset, i ) )
  }
  
  return infoTable
}

const load = inBuffer => {
  //copy so that modifying original buffer doesn't affect lumps and vice versa
  const wadBuffer = new Buffer( inBuffer )
  
  const header = getHeader( wadBuffer )
  const type = header.typeId
  const infoTable = getInfoTable( wadBuffer, header )

  const buffer = lump => 
    wadBuffer.slice( lump.filePosition, lump.filePosition + lump.size )

  const lumps = infoTable.map( 
    lump => ({
      name: lump.name,
      data: buffer( lump )
    })
  )
  
  return { type, lumps }
}  

const nullString = ( str, len ) => {
  if( str.length > len ){
    str = str.substr( 0, len )
  }
  
  while( str.length < len ){
    str += '\0'
  }
  
  return str
}

const save = wad => {
  const headerSize = 12
  const infoSize = wad.lumps.length * 16
  const lumpSize = wad.lumps.reduce( ( sum, lump ) => sum + lump.data.length, 0 )
  const wadSize = headerSize + lumpSize + infoSize
  
  const lumpsOffset = headerSize
  const infoTableOffset = lumpsOffset + lumpSize
  
  const wadBuffer = new Buffer( wadSize )

  //header
  wadBuffer.write( nullString( wad.type, 4 ), 0, 4, 'ascii' )
  wadBuffer.writeInt32LE( wad.lumps.length, 4 )
  wadBuffer.writeInt32LE( infoTableOffset, 8 )
  
  let filePosition = headerSize  
  
  wad.lumps.forEach( ( lump, i ) => {    
    const infoOffset = 16 * i + infoTableOffset    
    
    //info table entry
    wadBuffer.writeInt32LE( filePosition, infoOffset )
    wadBuffer.writeInt32LE( lump.data.length, infoOffset + 4 )
    wadBuffer.write( nullString( lump.name, 8 ), infoOffset + 8, 8, 'ascii' )    
    
    //lump
    lump.data.copy( wadBuffer, filePosition )
    
    filePosition += lump.data.length
  })
  
  return wadBuffer
}

module.exports = {
  load,
  save
}  