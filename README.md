![Codecov Coverage](https://img.shields.io/codecov/c/github/AhmedElwerdany/invoke-before-after)
![npm](https://img.shields.io/npm/v/invoke-before-after)
![GitHub Repo stars](https://img.shields.io/github/stars/AhmedElwerdany/invoke-before-after?style=social)

# invoke-before-after
tell your methods when to invoke by just naming them
## Installing
Using npm:

``
$ npm install invoke-before-after
``

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
    invokeBeforeSleep: function() {
      console.log('**yawning**')
    }
})

developer.sleep()

// output : 
// **yawning**
// **sleeping**
```
