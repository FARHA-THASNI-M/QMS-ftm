import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../firebase';
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react';
import Navbar from './Navbar';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To navigate to different routes after login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const role = await signIn(email, password);
      if (role === 'admin') {
        onLogin(role); // Update the state
        navigate('/admin'); // Redirect to admin dashboard
      } else if (role === 'counter') {
        onLogin(role); // Update the state
        navigate('/counter'); // Redirect to counter dashboard
      } else {
        setError('Unauthorized access');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="md:mx-64 mx-2 md:py-10 py-5 flex flex-col min-h-dvh min-w-screen">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <Card className="p-5 md:min-w-96">
          <CardHeader className="justify-center">
            <h2 className="font-semibold">Please Login Here</h2>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardBody className="gap-5">
              <Input
                type="email"
                label="Email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <Button className="bg-[#6236F5] text-white" type="submit">
                Submit
              </Button>
            </CardBody>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
