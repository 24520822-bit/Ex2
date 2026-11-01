import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App scaffold', () => {
  it('renders the directory heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Pioneer Directory' })).toBeInTheDocument();
  });
});
