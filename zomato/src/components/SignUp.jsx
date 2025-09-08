import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      setModalMessage(msg);
      setModalVisible(true);
      return;
    }

    const res = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.status === 200) {
      setError(''); // clear any previous errors
      setModalMessage('Signup successful');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigate('/signin');
      }, 2000);
    } else {
      setError(data.message);
      setModalMessage(data.message);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <section className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen sm:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create a new account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Inline error message for accessibility & testing */}
              {error && (
                <p role="alert" className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for success/error message */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-xs p-6 mx-auto bg-white rounded-lg shadow-lg">
            <p className="text-lg text-center">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
