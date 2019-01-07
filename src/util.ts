export const readInt32 = ( view: DataView, offset: number ) =>
  view.getInt32( offset, true )

export const writeInt32 = ( view: DataView, offset: number, value: number ) =>
  view.setInt32( offset, value, true )

export const readAscii = ( view: DataView, from: number, to: number ) => {
  let result = ''

  for ( let i = from; i < to; i++ ) {
    result += String.fromCharCode( view.getUint8( i ) )
  }

  return result.replace( /\0/g, '' )
}

export const writeAscii = ( view: DataView, offset: number, str: string ) => {
  for ( let i = 0; i < str.length; i++ ) {
    view.setUint8( offset + i, str.charCodeAt( i ) )
  }
}

export const ensureStringLength = ( str: string, len: number ) => {
  if ( str.length > len ) {
    str = str.substr( 0, len )
  }

  while ( str.length < len ) {
    str += '\0'
  }

  return str
}

export const lumpNameRegex = /[0-9A-Z\[\]_\-\\]+/
