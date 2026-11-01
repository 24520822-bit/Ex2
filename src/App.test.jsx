import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';
import { SMART_PEOPLE } from './data/smartPeople.js';

describe('App scaffold', () => {
  it('renders the directory heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Pioneer Directory' })).toBeInTheDocument();
  });
});

describe('directory search and IQ results', () => {
  it('searches scientist names without case sensitivity', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search scientists' }), 'eINsTeIn');

    expect(screen.getByText('Albert Einstein')).toBeInTheDocument();
    expect(screen.queryByText('Johann Goethe')).not.toBeInTheDocument();
  });

  it('filters scientists using the inclusive minimum IQ', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('spinbutton', { name: 'Minimum IQ' }), '205');

    expect(screen.getByText('Johann Goethe')).toBeInTheDocument();
    expect(screen.getByText('Albert Einstein')).toBeInTheDocument();
    expect(screen.queryByText('William Sidis')).not.toBeInTheDocument();
  });

  it('sorts results by descending IQ without mutating the source records', () => {
    const originalNames = SMART_PEOPLE.map(({ name }) => name);
    render(<App />);

    const names = within(screen.getByRole('list'))
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);

    expect(names).toEqual([
      'Johann Goethe',
      'Albert Einstein',
      'William Sidis',
      'Isaac Newton',
      'James Maxwell',
      'Leonardo da Vinci',
    ]);
    expect(SMART_PEOPLE.map(({ name }) => name)).toEqual(originalNames);
  });
});

describe('directory deletion and reset', () => {
  it('removes a scientist and restores the original directory on reset', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Delete Isaac Newton' }));

    expect(screen.queryByText('Isaac Newton')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('5 scientists');

    await user.click(screen.getByRole('button', { name: 'Reset directory' }));

    expect(screen.getByText('Isaac Newton')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('6 scientists');
  });
});
