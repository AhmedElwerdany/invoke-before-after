![Codecov Coverage](https://img.shields.io/codecov/c/github/AhmedElwerdany/invoke-before-after)
![npm](https://img.shields.io/npm/v/invoke-before-after)
![GitHub Repo stars](https://img.shields.io/github/stars/AhmedElwerdany/invoke-before-after?style=social)

# invoke-before-after
tell your methods when to invoke by just naming them
## Installing
Using npm:

```
npm install invoke-before-after
```

## API
##### invokeMeWrapper(target [, options])
- `target` A class or object that its methods should be proxied
- `options` <a href="#invokeMeWrapper-options">Options</a> to customize **invokeMeWrapper**


#### <a name="invokeMeWrapper-options">options</a> : 

| key |  description | default |
 -----|--------| --------|
| invokeAfterName| the prefix of the method that should be invoked **after** the original method . <a href="#with-options">(see examples)</a> |invokeAfter|
| invokeBeforeName|the prefix of the method that should be invoked **before** the original method .  <a href="#with-options">(see examples)</a>|invokeBefore|

## Example
with classes :
```javascript
import {invokeMeWrapper} from 'invoke-before-after'

class User {
   constructor(name) {
      this.name = name;
      this.updatedAt = new Date().toLocaleDateString()
   }

   updateName(name) {
      this.name = name;
      console.log('"name" updated')
   }
   // this method will be invoked after "updateName" method,
   // since it has "invokeAfter" then the name of the method
   // as the first letter of that method is uppercased
   invokeAfterUpdateName(){
      this.updatedAt = new Date().toLocaleDateString()
      console.log('"updatedAt" updated')
   }
}

const UserWrapper = invokeMeWrapper(User)
const newUser = new UserWrapper('Ahmed')

newUser.updateName()
// output : 
// "name" updated
// "updatedAt" updated

```

with objects :

```javascript
import {invokeMeWrapper} from 'invoke-before-after'

const developer = invokeMeWrapper({
    sleep: function () {
      console.log('**sleeping**')
    },
    // this method will be invoked after "sleep" method,
    // since it has "invokeBefore" then the name of the method
    // as the first letter of that method is uppercased
    invokeBeforeSleep: function() {
      console.log('**yawning**')
    }
})

developer.sleep()

// output : 
// **yawning**
// **sleeping**
```

<a id="with-options">with options</a>
```javascript
class User {
    sayHi() {
         console.log('saying hi')
    }

   _SayHi() {
      // should invoke after 'sayHi' method,
      // since we choose '_' for 'invokeAfterName' 
      console.log('I said hi :)')
   }

   $SayHi() {
      // should invoke before 'sayHi' method,
      // since we choose '$' for 'invokeBeforeName' 
      console.log("I'm gonna say hi")
   }
}

const UserWrapper = invokeMeWrapper(User, {
    invokeAfterName: '_',
    invokeBeforeName: '$',
})

const dev = new UserWrapper()
dev.sayHi()

// output: 
// I'm gonna say hi
// saying hi
// I said hi :)
```

