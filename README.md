![Codecov Coverage](https://img.shields.io/codecov/c/github/AhmedElwerdany/invoke-before-after)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
![npm](https://img.shields.io/npm/v/invoke-before-after)
<a href="https://github.com/AhmedElwerdany/invoke-before-after">![GitHub Repo stars](https://img.shields.io/github/stars/AhmedElwerdany/invoke-before-after?style=social) </a>

# invoke-before-after
Tell your methods when to invoke by just naming them that way.

## why?
- You want your methods to do only one thing.
- Small <a href="https://bundlephobia.com/package/invoke-before-after@1.3.2">bundle size</a> (1.4kB MINIFIED) - (648B MINIFIED + GZIPPED).

## Installing
Using npm:

```bash
npm install invoke-before-after
```

## Usage
CommonJS: 
```js
// CommonJS
const {invokeMeWrapper} = require('invoke-before-after')

// ES modules
import {invokeMeWrapper} from 'invoke-before-after'
```

## API
### invokeMeWrapper(target, [options])

wraps a target (class/object) with a special proxy/wrapper and provid it back to you as a class/object.
the method inside your object or class can invoke dynamically (without you calling them).

#### target : 
A class or object that its methods should be proxied.

#### <a name="invokeMeWrapper-options">options</a> : 

- <a href='#custom-names'>`invokeAfterName`</a>

  - Type: `string`
  - Default: `invokeAfter`
  
  A prefix for methods' name that should invoke **after** the targeted method.
  
  Assuming the targeted method is `getUsers`, and the **prefix** is `invokeAfter`. Then a method called `invokeAfterGetUsers` will invoke automatically after `getUsers` get invoked.
  
- <a href='#custom-names'>`invokeBeforeName`</a>

  - Type: `string`
  - Default: `invokeBefore`
  
  A prefix for methods' name that should invoke **before** the targeted method.
  
  Assuming the targeted method is `getUsers`, and the **prefix** is `invokeBefore`. Then a method called `invokeBeforeGetUsers` will invoke automatically before `getUsers` get invoked.

- <a href="#disable-camelcase">`disableCamelCase`</a>

  - Type: `boolean`
  - Default: `false`
  
  By default, the letter after the prefix should be uppercase. Set this to `true` will add the name of the targeted method as it is after the prefix.
  
  Assuming the targeted method is `getUsers`, and the **prefix** of `invokeAfterName` is `invokeAfter`.
  Set `disableCamelCase` to true will make `invokeAftergetUsers` the right function to invoke after `getUsers` instead of `invokeAfterGetUsers`.

## Example
With classes :
```javascript
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
const newUser = new UserWrapper('Mark')

newUser.updateName()
// output : 
// "name" updated
// "updatedAt" updated

```

With objects :

```javascript
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

### with options

<span id="custom-names">custom names :</span>
```javascript
class User {
    constructor(name) {
      this.name = name
      this.updatedAt = new Date().toLocaleDateString()
   }
   
    updateName(name) {
      this.name = name
      console.log('"name" Updated')
    }
    
    // should invoke before 'updateName' method,
    // since we chose '$' for 'invokeBeforeName' 
    $UpdateName(name) {
      console.log(`new name : ${name}`)
    }
   
   // should invoke after 'updateName' method,
   // since we chose '_' for 'invokeAfterName' 
   _UpdateName(name) {
      this.updatedAt = new Date().toLocaleDateString()
      console.log('"updatedAt" updated')
   }

}

const UserWrapper = invokeMeWrapper(User, {
    invokeAfterName: '_',
    invokeBeforeName: '$',
})

const dev = new UserWrapper('Peter')
dev.updateName('Mark')

// output: 
// new name : Peter
// "name" Updated
// "updatedAt" updated
```

<span id="disable-camelcase">Disable camelCase :</span>
```javascript

class User {
   sayHi() {
       console.log('saying hi')
   }
   
   // should invoke before 'sayHi' method,
   // since we chose '_' for 'invokeAfterName' 
   // and disable the camelcase naming convention
   _sayHi(){
       console.log('I said hi :)')
   }
}

User = invokeMeWrapper(User, {
   invokeAfterName: '_',
   disableCamelCase: true
})

const dev = new User()
dev.sayHi()

// output: 
// I'm gonna say hi
// saying hi
// I said hi :)
```

## License

[MIT](LICENSE)
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/EnigmaDamn"><img src="https://avatars.githubusercontent.com/u/86964602?v=4?s=100" width="100px;" alt=""/><br /><sub><b>EnigmaDamn</b></sub></a><br /><a href="https://github.com/AhmedElwerdany/invoke-before-after/commits?author=EnigmaDamn" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!