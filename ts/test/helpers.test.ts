import { camleCase, join, invokeSafe, bind } from './../src/helpers';

describe('helpers should work correctly' , () => {

    it('"camle case function" should work correctly' , () => {
        expect(camleCase).toBeDefined()
        expect(camleCase('xyz')).toBe('Xyz')
        expect(camleCase('XYZ')).toBe('XYZ')
        expect(camleCase('Xyz')).toBe('Xyz')
        expect(camleCase('xYz')).toBe('XYz')
        expect(camleCase('xYZ')).toBe('XYZ')
    })

    it('"join function" should work correctly' , () => {
        expect(join).toBeDefined()
        expect(join('xyz')).toBe('xyz')
        expect(join('123','4')).toBe('1234')
    })

    // TODO : test if some function got bound correctly
    // when we bound a function. there is a information there that we need to test
    // in order to make sure, that the "bind" action is acctuly done . 
    describe('"bind function" shoud work correctly' , () => {
        let fn = (a,b) => a + b
        
        // function fn1 () {
        //     const _this : any = this
        //     return _this.title
        // }
        // function fn2 (name) {
        //     const _this : any = this
        //     return _this.title + ' ' + name
        // }
        it('should return a function', () => {
            expect(typeof bind(fn, {}, [])).toBe('function')
        })
        // ? testing the function to be bound
        it('the returned function should be bound' , () => {
            expect(bind(fn,{}).name).toBe('bound fn')
            expect(bind(() => {}, {}).name).toBe('bound ')
        })
        it('should throw an error if a non-function type get passed' , () => {
            expect(bind(undefined, {} , [])).toThrowError('expected a function, recived undefined')
        } )
        // ? testing a function with no arguments and "thisArg"
        function noArgNoThis() {

        }
        // expect(bind(noArgNoThis,{}).name).toBe('bound noArgNoThis')
        // // ? testing a function with arguments but not "thisArg"
        // // ? testing a function with arguments and "thisArg"
        // expect(bind(fn, {}, [1,2])()).toBe(3)
        // expect(bind(fn1, {title : '123'}, [])()).toBe('123')

        // expect(bind(fn2, {title : 'title'}, ['ahmed'])()).toBe('title ahmed')
        
        // expect(bind(fn2, {}, [1,2])()).toBe('undefined 1')
        
    })

    it('"invoke safe function" shoud work correctly' , () => {
        const fn = jest.fn(x => x)
        invokeSafe(fn.bind(1))
        expect(fn.mock.calls.length).toBe(1)
    })



})