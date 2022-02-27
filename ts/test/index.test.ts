import { invokeMeWrapper } from '../src/index'

describe('invokeMeWrapper should work correctly', () => {
    describe('with classes', () => {

        const invokeAfterFn = jest.fn(() => 1)
        const invokeBeforeFn = jest.fn(() => 1)

        const shouldNotBeCalled = jest.fn(() => 1)

        const shouldReciveArguments = jest.fn((x) => x)

        class User {
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
        newUser.sayHi()

        it("should call 'invokeAfter' if exist", () => {
            expect(invokeAfterFn.mock.calls.length).toBe(1)
        })

        it("should call 'invokeBefore' if exist", () => {
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

    describe('with objects' , () => {

        const invokeAfterFn = jest.fn(() => 1)
        const invokeBeforeFn = jest.fn(() => 1)
        const shouldNotBeCalled = jest.fn(() => 1)
        const shouldReciveArguments = jest.fn((x) => x)
        
        const user = invokeMeWrapper({
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


        user.sayHi()

        it("should call 'invokeAfter' if exist", () => {
            expect(invokeAfterFn.mock.calls.length).toBe(1)
        })

        it("should call 'invokeBefore' if exist", () => {
            expect(invokeBeforeFn.mock.calls.length).toBe(1)
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