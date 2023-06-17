# babel-plugin-transform-barrels
This Babel plugin transforms indirect imports through a barrel file (index.js) into direct imports.

### Note
This plugin is intended for developers who use barrel files (index.js) with dynamic imports and/or CSS imports in their code when using the Webpack bundler. I don't know if it's needed to use in other bundlers such as Parcel, Rollup Vite and etc.

## Example

Before transformation:

```javascript
import { Button, List } from './components'
```

After transformation:

```javascript
import { Button } from './components/Button/Button'
import { List } from './components/List/List'
```


## Installation

1. Install the package using npm:

    ```bash
      npm install --save-dev babel-plugin-transform-barrels
    ```

2. Add the following to your webpack config file in the rule with a `babel-loader` loader:

    ```json
    "plugins": ["transform-barrels"]
    ```

   Alternatively, you can add `babel-plugin-transform-barrels` to your babelrc file:

    ```json
    "plugins": ["babel-plugin-transform-barrels"]
    ```

## The Problem

There are two issues that can occur in bundle files created by Webpack when using barrel files:
1. Unused CSS content in the CSS bundle file - this occurs when a CSS file is imported in a re-exported module of a barrel file.
2. Unused Javascript code in Javascript bundle files when using dynamic imports - this occurs when a barrel file is imported inside two different dynamically imported modules. This barrel file and its re-exported modules will be included twice in the two bundle files.

### Note
I recommend reading my article *Potential issues with barrel files in Webpack* for more information on possible issues can caused by barrel files.

## Possible Solutions

1. Use Babel plugins to convert import statements from indirect imports through barrel files to direct imports - this solution requires specific configuration for each package.
2. Use Webpack's built-in solution of `sideEffects: ["*.css", "*.scss"]` - this solution should replace the first solution above. However, it causes a new issue where the order of imported modules is not based on the order of import statements, but on usage order. This can cause unexpected visual issues due to changes in the import order of CSS.

Both solutions above are not optimal, so I decided to develop my own plugin that does not require specific configuration for each package.

## My Plugin Solution
My plugin examines every import in the Javascript project files and transforms it from an indirect import through a barrel file to a direct import from the module where the original export is declared.
