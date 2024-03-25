# Step 1 
### Project Setup
```
project-name/
├── src/
│   ├── controllers
│   ├── db
|   ├── middlewares
│   ├── models
|   ├── routes
|   ├── utils
|   |   └──  ApiError.js
|   |   └──  AsyncHandler.js
|   |   └──  ResponseMessage.js
|   ├── app.js
|   ├── constants.js
|   ├── index.js
│   └──  
├── public/
│   ├──temp
|      ├── 
|      └── ...
├── .gitgnore
├── .prettierignore
├── .prettierrc
├── node_modules/
├── package.json
├── package-lock.json
├── README.md
└── ...
```
 <img align="right" width="400" height="400" src="./gitimg/foldersetup.png"   alt="accessibility text"  >




This looks like a typical folder structure for a Node.js project. Let me break it down for you:

1. **src/:** This is the main source code directory, where you'll find the actual code for your application.

   - **controllers:** This folder likely contains modules or files that handle the application's business logic.
   - **db:** It probably holds database-related code, like database connection setup or schema definitions.
   - **middlewares:** This could include custom middleware functions for your Express.js application.
   - **models:** This is where you'd define your data models if you're using an ORM (Object-Relational Mapping) or similar.
   - **routes:** Here, you'd define the routes for your application using something like Express.js.
   - **utils:** This might contain utility functions or helper modules used across different parts of your application.
   - **app.js:** The entry point of your application. It's where your application is initialized, and often where the main server setup is done.
   - **constants.js:** This could store constants or configuration settings used throughout the application.
   - **index.js:** Another common entry point or a file that exports the main functionality of your application.

2. **public/:** This directory is typically meant for static assets that can be served directly by your web server.

   - **temp/:** It seems like a temporary directory, perhaps for storing temporary files during the operation of your application.

3. **.gitignore:** This file specifies intentionally untracked files that Git should ignore.

4. **.prettierignore:** Prettier is a code formatter. This file lists files or directories that Prettier should ignore.

5. **.prettierrc:** This file contains configuration options for Prettier.

6. **node_modules/:** This is where npm installs the project dependencies.

7. **package.json:** This file holds metadata about the project and its dependencies, as well as scripts to run various tasks.

8. **package-lock.json:** This file is automatically generated for any operations where npm modifies either the node_modules tree or package.json.

9. **README.md:** A documentation file that provides information about your project.

The structure follows common conventions for Node.js projects, especially those using frameworks like Express.js.

# Step 2 
### How to connect database in MERN with debugging

<table>
<tr>
<th>Explanation</th>
<th>Code</th>
</tr>
<tr>
<td>
<pre >
A connection method is typically used <br>to establish a connection between your <br>application and a database. It allows <br>your application to interact with the<br>database by sending queries, retrieving <br>data, and performing other database<br>operations.
</pre>
</td>
<td>

```
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"
const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGOGB_URI}/${DB_NAME}`);
        console.log(` MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log(error)
        process.exit(1);
    }
}
export default connectDB;
```

</td>
</tr>
</table>



1. here's a brief point-by-point explanation of the code:

2. mongoose, a MongoDB object modeling tool, is imported.

3. DB_NAME is imported from a constants file.

4. An asynchronous function connectDB is declared.

5. Inside connectDB, a try block is used to attempt a connection to the MongoDB database.

6. The connection string is formed using an environment variable MONGOGB_URI and DB_NAME.

7. If the connection is successful, a message is logged to the console with the host of the database.

8. If an error occurs during the connection, it is caught in the catch block.

9. The error is logged to the console and the process is exited with a failure code (1).

10. The connectDB function is exported for use in other parts of the application.

# Step 3
1. What is the use of CORS and app.use()
2. config cors with app.use()
3. now we settup in how many ways over application take data (like json , form body, data in url ) as set the data limit while sending data
4. config public folder
5. use cookiparser so only server can read and add cookies with the database
6. understand middlewale 

# step 4
1. start making models with the help of app.eraser.io or any tool 
2. search efficient with the help of index=true

## step 5 Try to  Make custom api response and erroe handling  

### The Utils folder in your project contains these utility files:

- ApiError.js: A custom error class for handling API-related errors
- AsyncHandler.js: A higher-order function for handling asynchronous functions and their errors
- ResponseMessage.js: Utility functions for generating and formatting API responses
``` 
- Request
The req object represents the HTTP request and has properties 
for the request query string,parameters, body, 
HTTP headers, and so on.

- HTTP Response Status Codes
Informational responses (100 – 199)
Successful responses (200 – 299)
Redirection messages (300 – 399)
Client error responses (400 – 499)
Server error responses (500 – 599)
```
1. - learn about  cookie-parser,cors.
2. - Node.js Error class
3. - learn about Status code 

````
const userschema = new mongoose.Schema({
        userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
},{timestamps:true})

=> Learn about pre method  in mongoose 

userschema.pre('save', async function(next){
    if(!this.isModified("password"))
    {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})

=> Study about methods object in mongoose.Schema 

userschema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}
````

# Step 6 File Uploader
1. learn what is callback
2. learn multer 
3. 
4.

### Callback
In JavaScript, a callback is a function that is passed as an argument to another function and is executed after a particular operation has been completed. Callback functions are commonly used in asynchronous programming, where operations like fetching data from a server or executing a time-consuming task are non-blocking, meaning they don't halt the execution of the program.

````
// Example of a callback function
function fetchData(callback) {
  // Simulating an asynchronous operation
  setTimeout(function() {
    const data = 'Data fetched successfully';
    // Calling the callback function with the fetched data
    callback(data);
  }, 2000); // Simulated delay of 2 seconds
}

// Function to handle the fetched data
function handleData(data) {
  console.log(data);
}

// Calling the fetchData function with the handleData callback
fetchData(handleData);

````
In this example:

- fetchData is a function that simulates fetching data asynchronously.
- handleData is a callback function passed to fetchData.
- After the data is fetched (simulated by a delay), the handleData callback is invoked with the fetched data as an argument.

## step 7 HTTP BASIC 
1. HTTP VS HTTPS
2. URL, URI, and URN
3. what is HTTP Header
4. Http Method
5. 

HTTP (Hypertext Transfer Protocol):

#### HTTP (Hypertext Transfer Protocol):
- Protocol for transmitting data over the internet.
- Not secure; data is transmitted in plain text.
- Uses port 80.
- Widely used for general web browsing and content delivery.
- HTTPS (Hypertext Transfer Protocol Secure):
#### HTTPS (Hypertext Transfer Protocol Secure): 
- Secure version of HTTP.
- Encrypts data transmitted over the internet using TLS or SSL.
- Uses port 443.
- Essential for secure communication, especially for transmitting sensitive information like login credentials and payment details.

### Here's a comparison of URL, URI, and URN in points:

URL (Uniform Resource Locator):
- Specifies the location of a resource on the internet.
- Consists of a protocol (e.g., http://, https://), domain name (or IP address), and optional path and query parameters.
- Example: https://www.example.com/page1.html
- Used to access resources such as web pages, images, files, etc.

URI (Uniform Resource Identifier):
- Identifies a resource on the internet, which can be located using a URL or another means.
- Encompasses both URLs and URNs.
- Example: https://www.example.com/page1.html
- Used for resource identification and can include URLs and URNs.

URN (Uniform Resource Name):
- Part of the URI specification.
- Identifies a resource by its name rather than its location or access method.
- Designed to be persistent and location-independent.
- Example: urn:isbn:0451450523 (identifies a book by its ISBN)
- Used for naming resources in a globally unique manner, regardless of where they are stored or accessed.

In summary, URL is a type of URI that specifies the location of a resource on the internet, while URN is another type of URI that identifies a resource by its name rather than its location. URI is a broader term encompassing both URLs and URNs.

#### HTTP HEADER
<img src="./gitimg//htttpHeader.png" width="350" title="hover text">
<img src="./gitimg//typesOfHeader.png" width="350" title="hover text">
<img src="./gitimg//httpMethod.png" width="350" title="hover text">
<img src="./gitimg//httpStatus.png" width="350" title="hover text">

## step 8 Learn about postman 
1. collection
2. env
3. how different api get hit 

## step 9 Access Refresh Token, Middleware and cookies


