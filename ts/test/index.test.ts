import { invokeMeWrapper } from '../src/index'

let invokeAfterFn,invokeBeforeFn,shouldNotBeCalled,shouldReciveArguments;

function setGlobalFunctions() { 
    invokeAfterFn = jest.fn(() => 1)
    invokeBeforeFn = jest.fn(() => 1)
    shouldNotBeCalled = jest.fn(() => 1)
    shouldReciveArguments = jest.fn((x) => x)
}

beforeEach(() => {
    return setGlobalFunctions()
})

describe('invokeMeWrapper should work correctly', () => {

    describe('with classes', () => {

        class User {
            property = 'value'

            sayHi() {
                console.log('saying hi')
            }

            invokeAfterSayHi(args) {
                invokeAfterFn()
            }

            invokeBeforeSayHi(args) {
                invokeBeforeFn()
            }

            // 🤫 sayHello does not exist
            invokeBeforeSayHello() {
                shouldNotBeCalled()
            }

            invokeAfterSayHello() {
                shouldNotBeCalled()
            }

            // 🥺 please pass me your arguments
            // 👉👈 is for me ?

            sayWelcome(name) {
                console.log(`welcome ${name}`)
            }

            invokeAfterSayWelcome(name) {
                shouldReciveArguments(name)
            }

            invokeBeforeSayWelcome(name) {
                shouldReciveArguments(name)
            }


        }

        const UserWrapper = invokeMeWrapper(User)
        const newUser = new UserWrapper()
        
        it('should get property without invoking anything' , () => {
            const result = newUser.property
            expect(invokeAfterFn.mock.calls.length).toBe(0)
            expect(invokeBeforeFn.mock.calls.length).toBe(0)
        })

        it("should call 'invokeAfter' if exist", () => {
            newUser.sayHi()
            expect(invokeAfterFn.mock.calls.length).toBe(1)
        })

        it("should call 'invokeBefore' if exist", () => {
            newUser.sayHi()
            expect(invokeBeforeFn.mock.calls.length).toBe(1)
        })

        it("should not call 'invokeBefore' or 'invokeAfter' if they are not attached to a method", () => {
            expect(shouldNotBeCalled.mock.calls.length).toBe(0)
        })

        it('should pass arguments', () => {
            newUser.sayWelcome('ahmed')

            expect(shouldReciveArguments.mock.calls.length).toBe(2)
            expect(shouldReciveArguments.mock.results[0].value).toBe('ahmed')
            expect(shouldReciveArguments.mock.results[1].value).toBe('ahmed')
        })
    })

    describe('with classes with options', () => {

        class User {
            property = 'value'
            sayHi() {
                console.log('saying hi')
            }

            _SayHi(args) {
                invokeAfterFn()
            }

            $SayHi(args) {
                invokeBeforeFn()
            }

            // 🤫 sayHello does not exist
            $SayHello() {
                shouldNotBeCalled()
            }

            _SayHello() {
                shouldNotBeCalled()
            }

            // 🥺 please pass me your arguments
            // 👉👈 is for me ?

            sayWelcome(name) {
                console.log(`welcome ${name}`)
            }

            _SayWelcome(name) {
                shouldReciveArguments(name)
            }

            $SayWelcome(name) {
                shouldReciveArguments(name)
            }


        }

        const UserWrapper = invokeMeWrapper(User , {
            invokeAfterName: '_',
            invokeBeforeName: '$'
        })

        const newUser = new UserWrapper()
        it('should get property without invoking anything' , () => {
            const result = newUser.property
            expect(invokeAfterFn.mock.calls.length).toBe(0)
            expect(invokeBeforeFn.mock.calls.length).toBe(0)
        })

        
        it("should call 'invokeBefore' if exist", () => {
            newUser.sayHi()
            expect(invokeBeforeFn.mock.calls.length).toBe(1)
        })

        it("should call 'invokeAfter' if exist", () => {
            newUser.sayHi()
            expect(invokeAfterFn.mock.calls.length).toBe(1)
        })


        it("should not call 'invokeBefore' or 'invokeAfter' if they are not attached to a method", () => {
            expect(shouldNotBeCalled.mock.calls.length).toBe(0)
        })

        it('should pass arguments', () => {
            newUser.sayWelcome('ahmed')

            expect(shouldReciveArguments.mock.calls.length).toBe(2)
            expect(shouldReciveArguments.mock.results[0].value).toBe('ahmed')
            expect(shouldReciveArguments.mock.results[1].value).toBe('ahmed')
        })
    })

    describe('with objects' , () => {
        
        const user = invokeMeWrapper({
            property: 'value',
            sayHi: function () {
                console.log('say hi')
            },
            invokeAfterSayHi: function () {
                invokeAfterFn()
            },
            invokeBeforeSayHi: function () {
                invokeBeforeFn()
            },
            invokeAfterSayHello: function () {
                shouldNotBeCalled()
            },
            sayWelcome: function (name) {
                console.log(`welcome ${name}`)
            },
            invokeAfterSayWelcome: function (name) {
                shouldReciveArguments(name)
            },
            invokeBeforeSayWelcome: function (name) {
                shouldReciveArguments(name)
            },
        })
        
        it('should get property without invoking anything' , () => {
            const result = user.property
            expect(invokeAfterFn.mock.calls.length).toBe(0)
            expect(invokeBeforeFn.mock.calls.length).toBe(0)
        })
        
        it("should call 'invokeBefore' if exist", () => {
            user.sayHi()
            expect(invokeBeforeFn.mock.calls.length).toBe(1)
        })

        it("should call 'invokeAfter' if exist", () => {
            user.sayHi()
            expect(invokeAfterFn.mock.calls.length).toBe(1)
        })


        it("should not call 'invokeBefore' or 'invokeAfter' if they are not attached to a method", () => {
            expect(shouldNotBeCalled.mock.calls.length).toBe(0)
        })

        it('should pass arguments', () => {
            user.sayWelcome('ahmed')

            expect(shouldReciveArguments.mock.calls.length).toBe(2)
            expect(shouldReciveArguments.mock.results[0].value).toBe('ahmed')
            expect(shouldReciveArguments.mock.results[1].value).toBe('ahmed')
        })

    })
})