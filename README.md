
# The Callback Stack architecture

## Introduction

The Callback Stack architecture is Render Props on steroids.  

## Basic Usage 

### 1. The Counter example

```jsx harmony
cs(
    ["count", ({}, next) => State({initValue: 0, next})],
    ({count})=>(
        <div>
            Count: {count.value}
            <button
                onClick={()=>count.change((v)=>v+1)}
            >+</button>

            <button
                onClick={()=>count.change((v)=>v-1)}
            >-</button>
        </div>
    ),
)
```
Here is the CodePen [demo](https://codepen.io/quanla/pen/JjEmOpP?editors=0010)


### 2. Simple stack with only 1 node

This is the most simple form of stack, a stack with only 1 node:

```jsx harmony
cs(
    () => (
        <div>
            Hello stack
        </div>
    )
)
```

The code above will work exactly like the following JSX code:

```jsx harmony
<div>
    Hello stack
</div>
```

### 3. Chain with 2 nodes

Let's add another node to make a proper "stack"
```jsx harmony
cs(
    ({}, next) => (
        <div>
            Hello stack

            {next()}
        </div>
    ),
    () => (
        <div>
            Hello stack 2
        </div>
    )
)
```

The code above will work exactly like the following JSX code:
```jsx harmony
<div>
    Hello stack

    <div>
        Hello stack 2
    </div>
</div>
```

As you can see here, the second node is applied precisely where we call "next" in the first stack command

### 4. Chain with variable assignment

Let's modify the above sample a little bit, and see something strange happen:
```jsx harmony
cs(
    ["aaa", ({}, next) => (
        <div>
            Hello stack

            {next("COOL")}
        </div>
    )],
    ({aaa}) => (
        <div>
            Hello stack {aaa}
        </div>
    )
)
```

The code above will work exactly like the following JSX code:
```jsx harmony
<div>
    Hello stack

    <div>
        Hello stack COOL
    </div>
</div>
```

In the 1st node, whatever value we pass into the "next()" function call will be available in following nodes as a variable named "aaa".


### 5. Direct value passing

Sometimes, a stack node only call directly the "next()" function to set variable:
```jsx harmony
cs(
    ["aaa", ({}, next) => next("COOL")],
    ({aaa}) => (
        <div>
            Hello stack {aaa}
        </div>
    )
)
```

The code above will work exactly like the following JSX code:
```jsx harmony
<div>
    Hello stack COOL
</div>
```

### 6. Sample usage with React Context

With Callback Stack:

```jsx harmony
cs(
    ["authentication", ({}, next) => (
        <Authentication.Consumer>
            {(authentication) => next(authentication)}
        </Authentication.Consumer>
    )],

    ["theme", ({}, next) => (
        <Theme.Consumer>
            {(theme) => next(theme)}
        </Theme.Consumer>
    )],

    ({authentication, theme}) => (
        <div style={{background: theme.background}}>
            {authentication.userName}
        </div>
    )
)
```

Notice: the `{(authentication) => next(authentication)}` part can be shorten to `{next}`

Without Callback Stack:

```jsx harmony
<Authentication.Consumer>
    {(authentication) => (
        <Theme.Consumer>
            {(theme) => (
                <div style={{background: theme.background}}>
                    {authentication.userName}
                </div>
            )}
        </Theme.Consumer>
    )}
</Authentication.Consumer>
```

You can imagine if we need to consume a few more context values, the indentation will be increased to the point that we no longer recognise our own code

### 7. Short-circuit stack (or conditional next)

The "next()" function provides a control to the flow of stack, and coder can decide where and when to call to next to execute the subsequence commands in the stack. In case "next()" is not called, the subsequence commands in the stack will not be executed at all, and appear to be totally cut-off

Example:

```jsx harmony
cs(
    ({auth}, next) => (
        <div>
            {auth.isLoggedIn ? (
                next()
            ) : (
                "Sorry, You have not logged in"
            )}
        </div>
    ),
    ({}) => (
        <div>
            User documents are listed here
        </div>
    )
)

```

Equivalent to the following JSX code:
```jsx harmony
<div>
    {auth.isLoggedIn ? (
        <div>
            User documents are listed here
        </div>
    ) : (
        "Sorry, You have not logged in"
    )}
</div>
```

### 8. Repeating

We can call "next()" more than once in a node, and each time it's called, the subsequence nodes are executed independently

```jsx harmony
cs(
    ["aaa", ({}, next) => (
        <div>
            <div>
                I am Foo
    
                {next("Foo")}
            </div>
            <div>
                I am Bar
    
                {next("Bar")}
            </div>
        </div>
    )],
    ({aaa}) => (
        <div>
            Hello {aaa}
        </div>
    )
)
```

JSX equivalence:
```jsx harmony
<div>
    <div>
        I am Foo

        <div>
            Hello Foo
        </div>
    </div>
    <div>
        I am Bar

        <div>
            Hello Bar
        </div>
    </div>
</div>
```

### 9. Let's try using callback stack without React

Since "cs" (Callback Stack) is a pure JS function with no dark corner, it's framework agnostic and can be used outside of React. Let's try a console.log:

```javascript
console.log(cs(
    ["a", ({}, next) => next(1)],
    ["b", ({}, next) => next(2)],
    ["c", ({}, next) => next(3)],
    ({a, b, c}) => a + b + c,
))
``` 

Will print to console: 
```
6
```

This flexibility opens up a wide range of opportunities to apply "cs" to many other different circumstances. I will give a more advanced sample later in Advanced Usage section

## API

The cs function receives a list of parameters (stack command), each stack command can be either a function or an array.

- In case the stack command is a function, the signature is:

```
(variables, [next]) => JSX.Element
```

Where variables is a map of all previously set variables in the stack, how to set these variable is explained below, where stack command is an array

The "next" param is a function, and is used to delegate the control to subsequence stack commands in the stack, so when next is called, the subsequence commands get executed

- In case the stack command is an array, it will be used to set a variable value. It should have 2 elements, first element is the variable name, the second variable is a function which has the same signature as the case above (where stack command is a function). When "next" function is invoke, we can pass in a parameter and that will be the value of the variable set into the stack.


## Comparison with other frameworks

Callback Stack does not directly compete with other programming frameworks (like Hooks, Redux, MobX...), and can live happily with any of them. However, once apply Callback Stack to the code base, it greatly reduce the code complexity to the point that is no longer necessary to use other frameworks.

### Compare with React Hooks

Common:
- Both provides a concise, un-indented way for a component to communicate with external module.
- Both promote localization of state data.

Pros:
- Callback Stack doesn't break the Pure Function contract, thus a Pure Functional component written with Callback Stack remains pure, whereas Hooks heavily contaminates the Pure Function concept to the point of unrecognizable.
- A Callback Stack node has the power of controlling flow (short-circuit, repeating...) whereas a Hooks call can only provide to the main flow and can not control it in anyway.
- Callback Stack is a normal JS function, which means it is runnable on many different contexts other than React, whereas a React Hook code will only be executable inside React application.
- Callback Stack module is normal React component (class or function), whereas Hooks module is a custom hook which is a heavily crippled down version of component.

Cons:
- Callback Stack code is more verbose than Hooks, not too much, but it is noticeable.
- As Callback Stack node is too powerful (controlling execution flow), it is confusing and scary to people who are new to the concept.


### With Redux

Common:
- Both promote uni-directional data flow
- Both provide a way to communicate between components over far distances (Callback Stack use React context, whereas Redux use store)

Pros:

- Callback Stack promotes localization whereas Redux promotes globalization. This is a pro because localization provides much better scope control, lifecycle control, separation of concerns, divide and conquer...
- Callback Stack doesn't require any setup whereas Redux require a global scope registration code, and connect code in every container component in the project, which is a lot
- Callback Stack code is less verbose than Redux code
- Callback Stack module is much more powerful, whereas Redux module is far weaker than even Hooks. Redux has always been about managing pure data, there is not even function to be stored in Redux, let alone flow control.

Cons:
- Callback Stack doesn't have a Debugger as robust as Redux's. In fact, Redux's debugger is exclusive to the globalization approach and is a bribe for developers to forget about the messy global storage nature (is it less messy if we can debug it?)


## History

### Render Props and why Angular/Flutter sucks

Angular/Flutter are actually 2 very popular and well accepted frameworks in the Front-end world however, underneath, both of them rely on a crippled diffing mechanism using data pointer. For simple cases, the mechanism works so well and nicely, but digging a little bit deeper, with some advanced alias data handling, or DOM shifting, that mechanism just fall apart. By "fall apart", I don't mean they can't do it, but there is a huge toll (workarounds, code verbosity, external lib dependencies) placed upon the code base, to the point people start wondering is there a better way.

The lack of Virtual DOM in those 2 frameworks prevent any usage of Render Props here, and Render Props is "a better way", yet, to use it we must turn to React or Vue, or any other frameworks that has Virtual DOM.

### React's struggle with state data and Render Props to the rescue

React's state has always been a grey area among the community. Is it good? Is it bad? People has always been guessing and discussing. State seems great at beginning (hello world level) where there are not too many of them, but nightmares soon come afterward. The problem with state is that it is hidden from global view and when coder loss control over it (manipulate too many states in a single component) then it is almost unpredictable of how the application will behave.

This issue is often reduced to the incapability of separating blocks of logic and grouping them into a component of same concern. Why we are not capable of separating? because state is local to component and it's only available inside that component or the child component which is constructed locally (in render function), that's why if a block of code want to access that state, it must be either inside the same component or child component that is defined locally.

State has always been invisible to code blocks outside of the component.

Render props has always provided a solution to this problem, and with Render props, code blocks outside of that component can easily access state. The solution is we provide the component with a function prop, and by calling that function, the component can pass state into it and that state will be accessible outside. Here is an example:

```js
export class SampleState extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: "Hello",
        };
    }
    render() {
        const {next} = this.props;
        const {value} = this.state;

        return next(value);
    }
}
```

And to use it outside:
```jsx harmony
<SampleState
    next={(state)=> (
        <div>
            {state} world
        </div>
    )}
/>
```

### Render Props over-looked and the rise of Redux, Hooks

Because of the Pyramid of Doom problem, which is so heavy and obvious, people turn away from Render Props at very first sight, but the issue with React's state is still there, that's where Redux come into play.

Redux provides a way to make state publicly available to every component in the whole application, solving the communication problem in an absolute way. People never have to worry about how to access a certain state, because it's always available right there. On top of that is a super sleek debugger, making state manipulations as obvious as daylight.

However, by solving 1 problem, Redux brings another problem into the table, which is globalization, and with it is accessibility control, naming clash, trash cleanup... Seems like the problem Redux brings is a much bigger and more fundamental that the one it solves. That's why the search for a better way continues.

MobX is often praised as a better alternative than Redux, because it does not promote globalization. MobX tries to solve the communication problem but at the same time, maintain a certain level of localization.

Then new React context arrives, which promise to solve the communication problem too, but React context use Render Props, and the Pyramid of Doom turn people away almost immediately. There is no way for an application to be developed with React context exclusively, replacing Redux totally. The Pyramid of Doom toll is simply too high to take.

And then we have Hooks, an attempt to solve the Pyramid of Doom problem and bringing back React context to the table.

There are also various other attempts of the community to make use of Render Props, which is listed here:

https://github.com/jaredpalmer/awesome-react-render-props

## Advanced usage


### 1. Dynamic construct

Here is an assignment node:
```javascript
cs(
    ["aaa", ({}, next) => next("COOL")],
)
```

As you can see, the name of the variable ("aaa") is defined as a string literal, that mean the whole assignment construct in Callback Stack is totally dynamic, which means it can be generated/returned by calculation.

So this is the exact same node:

```javascript
cs(
    ["aa" + "a", ({}, next) => next("COOL")],
)
```

Or:

```javascript
cs(
    directSet("aaa", "COOL"),
)

function directSet(varName, value) {
    return [varName, ({}, next) => next(value)];
}
```

This allows for more flexible ways to compose stack nodes

### 2. Sub-stack

We can nest 1 cs call in another cs, this way we can create a separate sandbox for child "cs", and still capable of returning/exporting value to outside

```jsx harmony
cs(
    ["aaa", ({}, next) => cs(
        ["bbb", ({}, next) => next("COOL")],
        ({bbb}) => next(bbb),
    )],
    ({aaa, bbb}) => ( // aaa is "COOL", bbb is undefined
        <div>
            {aaa}
            {bbb === undefined && "bbb is undefined"}
        </div>
    )
)
```

The "bbb" variable is only available inside the inner cs stack. And note that in the second node of the inner "cs", the "next" function is passed from outer "cs", which means the "bbb" value is passed to outside stack, and then be assigned to variable "aaa"

### 3. Exporting objects

With the help of Render Props (and Callback Stack), a React component can now export almost anything to outside

```javascript
export class UseState extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: props.initValue,
        };
    }
    render() {
        const {next} = this.props;
        const {value} = this.state;

        return next({
            value,
            onChange: (value) => this.setState({value}),
        });
    }
}
```

And here is a sample counter:

```jsx harmony
cs(
    ["count", (_, next) => h(UseState, {initValue: 0, next})],
    ({count}) => (
    <div>
        <h2>Count: { count.value } </h2>
        <button
            onClick={ () => count.onChange(count.value + 1) }
        >
            +
        </button>
        <button
            onClick={ () => count.onChange(count.value - 1) }
        >
            -
        </button>
    </div>
    )
)
```


### 4. Leverage child components

Sometimes, a child component need to provide state to a sibling. Let's leverage it up but in a graceful way:

Child component:
```jsx harmony

const Child1 = ({next}) => cs(
    ["state", ({}, next) => next("AAA")],
    ({state}) => next({
        state,
        render: () => (
            <div>
                Child 1
            </div>
        ),
    }),
)
```

Parent:

```jsx harmony
cs(
    ["child", ({}, next) => Child1({next})],
    ({child}) => (
        <div>
            {child.render}
            
            <Child2 siblingState={child.state} />
        </div>
     ),
)
```

This is how we can render child 1 right next to child 2, yet, provide child 1's state to child 2 as a props


### 5. Context with ease

Although Callback Stack support using React Context in the original way, it is much easier to use the context.ts library.

To provide the context value:

```jsx harmony
cs(
    ({}, next) => provideContext({aaa: "Anything"}, next),
)
```

to use/consume the context value:
```jsx harmony
cs(
    consumeContext("aaa"),
    ({aaa}) => (
        <div>
            This can be {aaa}
        </div>
    ) // Will show "This can be Anything" to the screen
)
```

### 6. Branching

Similar to "Short-circuit" technique, where the flow of commands is cut-off when next is not called, the "Branching" technique maintain 2 flows of commands nodes, one is the main flow that often always stay attached to Virtual Dom tree, and another flow may be cut off on some certain condition.

Example of this technique is the Modal Service that exist in various places in the source code:

```jsx harmony
cs(
    ["modal", (_, next) => <ModalService {...{
        render: (_, rm) => next({close: rm}),
        next: rootNext,
    }}/>],

    ({modal}) => (
        <div className="modal-2qx">
            Modal content

            <button onClick={()=> modal.close()}>Close modal</button>
        </div>
    ),
)
```

Here, at the first command node we see the existent of 2 "next" functions, one is passed into the command function like normal next, and another one (rootNext) is often passed into the main component props. At this node, the 2 next functions are used differently. The "rootNext" is passed into ModalService component and will carry the modal's main export object to outside, that export object should have the "show" function. The "next" function is directly called in the command node, and an object with "close" method is sent down the stack for other command to control when to close the component.

If you get confused at this point, don't worry, this technique is very advanced and it's ok if you just copy/paste here, because all the complexities is embedded in the ModalService component, and what you are copy/pasting is only minimum declaration and standard verbosity.

### 7. More non-JSX sample: Stacking db connections

This sample is to continue showing how "cs" can be used in various other circumstances outside of React JSX

In fact, similar to js Promise, "cs" does work with various circumstances that involve advance usage of callbacks.

Let's imagine we have a db connection function like this:

```js
connectToDb("remote-host-1", async (db)=> {
    const user1 = await db.select("user");
    await db.insert("user", user1);
});

async function connectToDb(address, callback) {
    const db = {}; //... open connection
    await callback(db);
    db.end();
}
```

the connectToDb will open a new connection to db, and wait for callback function to finish execution, then close the connection. This makes sure that the connection is not closed until callback function had finish.

The connectToDb is actually very robust in the way that it can simultaneously open and manipulate connections to multiple db hosts:

```js
connectToDb("remote-host-1", async (db1)=> {
    await connectToDb("remote-host-2", async (db2)=> {
        await connectToDb("remote-host-3", async (db3)=> {
            const user1 = await db1.select("user");
            const user2 = await db2.select("user");

            await db3.insert("user", user1);
            await db3.insert("user", user2);
        });
    });
});
```

And after all select and insert actions is done, all db connections will only be closed. Great right? however, here we see another Pyramid of Doom problem that the main code blocked is indented with each new connection opened, and also, there is no way to dynamically choose the number of hosts to connect to.

Now let's see how can we use "cs" to make it better:

```js
cs(
    ["db1", (_, next) => connectToDb("remote-host-1", async (db)=> {
        return await next(db);
    })],
    ["db2", (_, next) => connectToDb("remote-host-2", next)],
    ["db3", (_, next) => connectToDb("remote-host-3", next)],
    async ({db1, db2, db3}) => {
        const user1 = await db1.select("user");
        const user2 = await db2.select("user");

        await db3.insert("user", user1);
        await db3.insert("user", user2);
    },
)
```

Notice that the db2 line `["db2", (_, next) => connectToDb("remote-host-2", next)]` works exactly the same way as the db1, just that it is purposely shrunk down to demonstrate how short and concise it can be

Now that we have "cs" applied and no matter how many db connections we have to make, the main code (select and insert) will not be indented at all. Every thing else works exactly the same way, especially how the connectToDb will have to wait for all executions to finish before closing db connection.

