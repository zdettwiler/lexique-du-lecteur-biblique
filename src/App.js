import { useState } from 'react';
import './App.css';
import { createLexicon, otBooks } from './createLexicon'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { , ThemeProvider } from '@mui/material/styles';

function App() {
  const [book, setBook] = useState('Genèse');

  function handleChangeBook(e) {
    setBook(e.target.value);
  }

  function getBook() {
    createLexicon(book);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
          sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
          }}
      >
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={book}
              label="Livre"
              onChange={handleChangeBook}
          >
            { otBooks.map((book, i) => {
              return <MenuItem value={book} key={i}>{book}</MenuItem>
            }) }

          </Select>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={getBook}
        >
          Créer mon lexique
        </Button>
      </Box>
    </Container>
  );
}

export default App;
