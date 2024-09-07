import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Message from "./components/Message";

import {
  Container,
} from '@mui/material'

import { Routes, Route } from 'react-router-dom'

import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <Container
        sx={{
          marginBlockStart: '1rem'
        }}
      >
          <Routes>
            <Route path='/' element={<Authors />} />
            <Route path='/books' element={<Books />} />
            <Route path='/books/add' element={<NewBook />} />
          </Routes>
      </Container>
      <Message />
    </>
  );
};

export default App;
