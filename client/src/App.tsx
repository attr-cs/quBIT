import { useState } from 'react'
import './App.css'

import {Add, Mul} from '../src/components/testing'
type User = {
  id: number, 
  name: string
};
type Compo2Props = {
  namew?: string,
  age: number
};
function App() {
  const [user,  setUser] = useState<User>({id:1, name:"ritik"});
  return (
    <>
      <div>
        {user.id}
        {user.name}

        {typeof user}
        <pre>{JSON.stringify(user, null, 2)}</pre>
        { typeof JSON.stringify(user)}
        <Mul a={2} b={4}/>
        <Component2 />
      </div>
    </>
  )
}

function Component2({namew,age}: Compo2Props){
  return <h1>compo2 {namew}{age}</h1>
}

Component2.defaultProps = {
  namew:"hello", age:12,
};

export default App
