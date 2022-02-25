# invoke-before-after
a wrapper around your objects to invoke your methods by just their names
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
