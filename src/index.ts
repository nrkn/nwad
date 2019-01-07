import { Wad, Lump, WadType } from './types'
import { writeAscii, writeInt32, readAscii, readInt32, ensureStringLength, lumpNameRegex } from './util'

export const load = ( data: Uint8Array ) => {
  const view = new DataView( data.buffer )

  const header = getHeader( view )
  const type = header.typeId
  const infoTable = getInfoTable( view, header )

  const getLumpData = ( info: WadInfo ) =>
    new Uint8Array(
      data.slice( info.filePosition, info.filePosition + info.size )
    )

  const lumps = infoTable.map(
    info => ( <Lump>{
      name: info.name,
      data: getLumpData( info )
    } )
  )

  return <Wad>{ type, lumps }
}

export const save = ( wad: Wad ) => {
  const headerSize = 12
  const infoSize = wad.lumps.length * 16
  const lumpSize = wad.lumps.reduce(
    ( sum, lump ) =>
      sum + lump.data.length,
    0
  )
  const wadSize = headerSize + lumpSize + infoSize

  const lumpsOffset = headerSize
  const infoTableOffset = lumpsOffset + lumpSize

  const data = new Uint8Array( wadSize )
  const view = new DataView( data.buffer )

  //header
  writeAscii( view, 0, ensureStringLength( wad.type, 4 ) )
  writeInt32( view, 4, wad.lumps.length )
  writeInt32( view, 8, infoTableOffset )

  let filePosition = headerSize

  wad.lumps.forEach( ( lump, i ) => {
    if( !lumpNameRegex.test( lump.name ) )
      throw Error( `Bad lump name: ${ lump.name }` )

    const infoOffset = 16 * i + infoTableOffset

    //info table entry
    writeInt32( view, infoOffset, filePosition )
    writeInt32( view, infoOffset + 4, lump.data.length )
    writeAscii( view, infoOffset + 8, ensureStringLength( lump.name, 8 ) )

    //lump
    data.set( lump.data, filePosition )

    filePosition += lump.data.length
  } )

  return data
}

interface WadHeader {
  typeId: WadType
  numberOfLumps: number
  infoTableOffset: number
}

interface WadInfo {
  id: number
  filePosition: number
  size: number
  name: string
}

const getHeader = ( view: DataView ) => {
  const typeId = readAscii( view, 0, 4 )
  const numberOfLumps = readInt32( view, 4 )
  const infoTableOffset = readInt32( view, 8 )

  return <WadHeader>{
    typeId,
    numberOfLumps,
    infoTableOffset
  }
}

const getInfo = ( view: DataView, offset: number, id: number ) => {
  const filePosition = readInt32( view, offset )
  const size = readInt32( view, offset + 4 )
  const name = readAscii(  view, offset + 8, offset + 16 )

  return <WadInfo>{
    id,
    filePosition,
    size,
    name
  }
}

const getInfoTable = ( view: DataView, header: WadHeader ) => {
  const infoTable: WadInfo[] = []

  for ( let i = 0; i < header.numberOfLumps; i++ ) {
    const offset = 16 * i + header.infoTableOffset
    infoTable.push( getInfo( view, offset, i ) )
  }

  return infoTable
}

