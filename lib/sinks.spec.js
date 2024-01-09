import { mergeSinks } from './sinks'
import xs from 'xstream'

describe( 'sinks', () => {
  it( 'should merge sinks', ( done ) => {
    const sinks = () => mergeSinks(
      {
        sink: xs.of( 1 )
      },
      {
        sink: xs.of( 2 ),
      }
    )

    sinks().sink.take( 1 ).subscribe( {
      next: number => {
        expect( number ).toEqual( 1 )
      }
    } )
    sinks().sink.drop( 1 ).subscribe( {
      next: number => {
        expect( number ).toEqual( 2 )
        done()
      }
    } )
  } )
} )