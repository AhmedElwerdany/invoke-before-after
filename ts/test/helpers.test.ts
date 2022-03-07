import { DEFAULT_OPTIONS, OptionsI } from './../src/constants';
import { camleCase, join, invokeSafe, bind, generateMethodName } from './../src/helpers';

describe('helpers should work correctly', () => {

    it('"camle case function" should work correctly', () => {
        expect(camleCase).toBeDefined()
        expect(camleCase('xyz')).toBe('Xyz')
        expect(camleCase('XYZ')).toBe('XYZ')
        expect(camleCase('Xyz')).toBe('Xyz')
        expect(camleCase('xYz')).toBe('XYz')
        expect(camleCase('xYZ')).toBe('XYZ')
    })

    it('"join function" should work correctly', () => {
        expect(join).toBeDefined()
        expect(join('xyz')).toBe('xyz')
        expect(join('123', '4')).toBe('1234')
    })

    describe('"bind function" shoud work correctly', () => {
        let fn = (a, b) => a + b

        it('should return a function', () => {
            expect(typeof bind(fn, {}, [])).toBe('function')
        })
        // ? testing the function to be bound
        it('the returned function should be bound', () => {
            expect(bind(fn, {}).name).toBe('bound fn')
            expect(bind(() => { }, {}).name).toBe('bound ')
        })
        it('should throw an error if a non-function type get passed', () => {
            expect(bind(undefined, {}, [])).toThrowError('expected a function, recived undefined')
        })
    })

    it('"invoke safe function" shoud work correctly', () => {
        const fn = jest.fn(x => x)
        invokeSafe(fn.bind(1))
        expect(fn.mock.calls.length).toBe(1)
    })


    describe('generateMethodName should work correctly', () => {
        it.each([
            {
                options: null,
                expected: {
                    invokeAfterName: 'invokeAfterMethod',
                    invokeBeforeName: 'invokeBeforeMethod'
                }
            },
            {
                options: {
                    disableCamelCase: true
                },
                expected: {
                    invokeAfterName: 'invokeAftermethod',
                    invokeBeforeName: 'invokeBeforemethod'
                },

            },
            {
                options: {
                    invokeAfterName: '_',
                    invokeBeforeName: '$'
                },
                expected: {
                    invokeAfterName: '_Method',
                    invokeBeforeName: '$Method'
                },
            },
            {
                options: {
                    invokeAfterName: '_',
                    invokeBeforeName: '$',
                    disableCamelCase: true
                },
                expected: {
                    invokeAfterName: '_method',
                    invokeBeforeName: '$method'
                },
            }
        ])('should get the right name with $options', ({options, expected}) => {
            const _options: any = options ? {...DEFAULT_OPTIONS, ...options} : DEFAULT_OPTIONS
            expect(generateMethodName('method', _options)).toEqual(expected)
        })
    })

})