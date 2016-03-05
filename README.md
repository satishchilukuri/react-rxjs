# Model-View-Intent example with React and RxJS

See [my blog post](https://satishchilukuri.com/blog/entry/model-view-intent-with-react-and-rxjs) for an explanation of this example.

## Installation

After checking out, cd to the directory where the code is checked out, and then:

```
npm install
npm run build

```

## Running the example

The `package.json` file for this example includes [json-server](https://github.com/typicode/json-server). To start it:

```
npm run json-server
```

Then open `index.html` file in the browser.

## If you don't have npm

If you don't know what npm is, or don't have it installed, you can still run the example after editing some code. You just need to use a public REST API url instead of the url of the local json-server.

Open the file `build/app.js`. Search for this line:

```
var RESOURCE_URL = "http://localhost:3000/users/";
```

Replace it with this:

```
var RESOURCE_URL = "http://jsonplaceholder.typicode.com/users/";
```

Then open `index.html` in the browser.

Note that though the public REST API allows us to make DELETE requests, it doesn't actually delete any data. So even if you use the delete button in example, the user won't get deleted.