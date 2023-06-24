import './App.css';
import { createLexicon, atBooks } from './createLexicon'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { , ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    // <ThemeProvider theme={defaultTheme}>
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
                value={"Genèse"}
                label="Livre"
                onChange={createLexicon}
            >
              { atBooks.map(book => {
                return <MenuItem value={book}>{book}</MenuItem>
              }) }

            </Select>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    // </ThemeProvider>
  );
}

export default App;
