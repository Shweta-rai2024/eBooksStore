import React ,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFirebase } from '../context/Firebase';
const LoginPage = () =>{
    console.log('here');
    const firebase=useFirebase();
    const[email,setEmail]=useState('');
    const[password,setPassword] = useState('')
    const handleSubmit = async(e) =>
    {
      e.preventDefault();
      console.log("signing up a user...")
     const result =  await firebase.signInWithEmailAndPassword(email,password);

    };
    return(
        <div className='container'>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onChange={(e) => setEmail(e.target.value)}
           type="email"
           value={email}
            placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Account
        </Button>
      </Form>
      <h1 className="mt-5 mb-5">
        OR
      </h1>
      <Button onClick={firebase.signInWithGoogle} variant ="danger">Sign In with google</Button>
      
      </div>
    )
}
export default LoginPage