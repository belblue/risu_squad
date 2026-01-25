import { input } from "@testing-library/user-event/dist/cjs/event/input.js";
import { useEffect, useState } from "react";
function PersonForm() {
  const [person, setPerson] = useState({ name: "", age: 0 });
  return (
    <>
      {person.name === "" && person.age === 0 ? (
        <p>empty user</p>
      ) : (
        <p>
          User name : {person.name}, User age: {person.age}
        </p>
      )}
      <p>Name</p>
      <input
        type="text"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
      />
      <p>Age</p>
      <input
        type="number"
        value={person.age}
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) })
        }
      />
    </>
  );
}

function Subscription() {
  useEffect(() => {
    console.log("mount");
    return () => console.log("unmount");
  }, []);
  return <p>Simple message</p>;
}

function ColorList() {
  const [colours, setColours] = useState(["red", "green", "blue"]);
  const handleDelete = (itemToDelete) => {
    setColours(colours.filter((item) => item !== itemToDelete()));
  };
  return (
    <ul>
      {colours.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => handleDelete(item)}>delete</button>
        </li>
      ))}
    </ul>
  );
}

function LoginStatus() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {!isLoggedIn ? <p>Please log in.</p> : <p>Welcome back!</p>}
      <button onClick={() => setLoggedIn((prev) => !prev)}>Toggle state</button>
    </div>
  );
  // Your code here
}

function FocusInput() {
  // Your code here
  const inputField = useRef(null);

  const handleFocus = () => {
    inputField.current.focus();
  };
  return (
    <>
      <input ref={inputField} />
      <button onClick={handleFocus}></button>
    </>
  );
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage:
const [name, setName] = useLocalStorage("name", "Guest");

/*--------*/
interface DisplayProp {
  count: number;
}
interface ControlProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}

function Parent() {
  // Where should state live?
  const [count, setCount] = useState(0);
  return (
    <div>
      <Display count={count} />
      <Controls count={count} setCount={setCount} />
    </div>
  );
}

function Display({ count }: DisplayProp) {
  return <p>Count: {count}</p>;
}

function Controls({ count, setCount }: ControlProps) {
  return (
    <div>
      <button onClick={() => setCount((prev) => prev - 1)}>-</button>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
}

////////

interface User {
  name?: string;
  email?: string;
}
function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetching() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users/1",
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetching();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>User empty</p>;
  return (
    <p>
      {user.name} {user.email}
    </p>
  );
}

useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);




setTodos(todos.map(todo=>
  todo.id ==id ? {...todos,done: todo.!done}
  : todo
))

SliceOffsetOutOfBoundsError(toBlobSidecars.map(todo =>
  todo.id === id ? {...todos,done:todo.!done} : todos))
)
jsx// UPDATE item in array
arr.map(item => item.id === targetId ? { ...item, field: newValue } : item)

// REMOVE item from array
arr.filter(item => item.id !== targetId)


function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect (()=>{
  async function fetchPosts(){
  try{
//fetches from api
  const response = await fetch("https://api.example.com/posts")
  const data = await response.json()  
  //Sets post state with the data
  setPosts(data)
  }catch (error){
    console.error('error',error)
  }finally{

  //sets loading to false succes/error
  setLoading(false)
  }
    
  }
fetchPosts()
},[])



  if (loading) return <p>Loading...</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
