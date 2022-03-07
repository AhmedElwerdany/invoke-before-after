import { DEFAULT_OPTIONS } from './../src/constants';
import { invokeMeWrapper } from '../src/index'

// global functions
let invokeAfterFn, invokeBeforeFn;

// global class
let Class, newObject, ClassWrapper;
/**
 * ! 🔹 (1) Should set a normal method, with its (invokeAfter, invokeBefore)
 * ! 🔹 (2)  should set a noraml method, with its (invokeAfter, invokeBefore) but renamed to (_,$)
 * ! 🔹 (3) should set a noraml method, with its (invokeAfter, invokeBefore) 
 * ! but renamed to (_,$), and the letter after that is lettercased
 * 
 * ! 🔷 for each one of those (1) (2) (3), add its (invokeAfter, invokeBefore) without the parent method.
 */

function setGlobalClass() {
    /**
     * everyone of the methods takes the name of the parent method as a last argumnet
     * to test in which context this function with invoked.
     */
    Class = class {
        property = 'value'

        method(...args) {
            return true
        }
        /**
         * ! default names with camelcase as a naming convention
         */
        invokeAfterMethod(...args) {
            invokeAfterFn(...args, 'invokeAfterMethod')
        }

        invokeBeforeMethod(...args) {
            invokeBeforeFn(...args, 'invokeBeforeMethod')
        }

        /**
         * ! custom names with camelcase as a naming convention
         */
        _Method(...args) {
            invokeAfterFn(...args, '_Method')
        }

        $Method(...args) {
            invokeBeforeFn(...args, '$Method')
        }

        /**
         * ! default names with camelcase **disabled**
         */
        invokeAftermethod(...args) {
            invokeAfterFn(...args, 'invokeAftermethod')
        }

        invokeBeforemethod(...args) {
            invokeBeforeFn(...args, 'invokeBeforemethod')
        }

        /**
         * ! custom names with camelcase **disabled**
         */
        _method(...args) {
            invokeAfterFn(...args, '_method')
        }

        $method(...args) {
            invokeBeforeFn(...args, '$method')
        }
    }
}

function setWrapper() {
    ClassWrapper = invokeMeWrapper(Class)
}

function setWrapperWithOptions(options) {
    ClassWrapper = invokeMeWrapper(Class, options)
}


function setGlobalObject(type: 'class' | 'object' = 'class') {
    if (type === 'class') {
        newObject = new ClassWrapper()
    }
}


function setClassTest(options) {
    setGlobalClass()
    if (options) {
        setWrapperWithOptions(options)
    } else {
        setWrapper()
    }
    setGlobalObject()
}

function setObjectTest(options) {
    setGlobalClass()
    if(options) {
        newObject = invokeMeWrapper(new Class(), options)
    }else {
        newObject = invokeMeWrapper(new Class())
    }
}

const types = ['class', 'object']

for(let type of types) {
    describe.each(
        [
            {
                type,
                options: null,
                expected : {
                    invokeAfterName: 'invokeAfterMethod',
                    invokeBeforeName: 'invokeBeforeMethod'
                }
            },
            {
                type,
                options: {
                    disableCamelCase: true
                },
                expected : {
                    invokeAfterName: 'invokeAftermethod',
                    invokeBeforeName: 'invokeBeforemethod'
                },
    
            },
            {
                type,
                options: {
                    invokeAfterName: '_',
                    invokeBeforeName: '$'
                },
                expected : {
                    invokeAfterName: '_Method',
                    invokeBeforeName: '$Method'
                },
            },
            {
                type,
                options: {
                    invokeAfterName: '_',
                    invokeBeforeName: '$',
                    disableCamelCase: true
                },
                expected : {
                    invokeAfterName: '_method',
                    invokeBeforeName: '$method'
                },
            }
        ])('test: $type , with options: $options', ({ type, options, expected }) => {
            // if options provided, merge it (custom options) with DEFAULT_OPTIONS 
            // if not, options is DEFAULT_OPTIONS
            options = options ? {...DEFAULT_OPTIONS, ...options} : DEFAULT_OPTIONS
    
            // making the class
            beforeAll(() => {
                if(type === 'class') {
                    setClassTest(options)
                } else {
                    setObjectTest(options)
                }
            })
    
            beforeEach(() => {
                invokeAfterFn = jest.fn((x) => x)
                invokeBeforeFn = jest.fn((x) => x)
            })
    
            afterEach(() => {
                jest.resetAllMocks()
            })
    
            it('should get property without invoking anything', () => {
                const result = newObject.property
                expect(invokeAfterFn.mock.calls.length).toBe(0)
                expect(invokeBeforeFn.mock.calls.length).toBe(0)
            })
          
            it(`should call '${expected.invokeAfterName}' if exist`, () => {
                    newObject.method()
                    expect(invokeAfterFn.mock.calls.length).toBe(1)
                    expect(invokeAfterFn.mock.calls[0][0]).toBe(expected.invokeAfterName)
            })
    
            it(`should call '${expected.invokeBeforeName}' if exist`, () => {
                newObject.method()
                expect(invokeBeforeFn.mock.calls[0][0]).toBe(expected.invokeBeforeName)
            })
    
            it('should pass arguments', () => {
                newObject.method('test_arguments')
                expect(invokeAfterFn.mock.calls[0][0]).toBe('test_arguments')
                expect(invokeAfterFn.mock.calls[0][1]).toBe(expected.invokeAfterName)
    
                expect(invokeBeforeFn.mock.calls[0][0]).toBe('test_arguments')
                expect(invokeBeforeFn.mock.calls[0][1]).toBe(expected.invokeBeforeName)
            })
    
        })
}