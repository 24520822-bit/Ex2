import { Profiler } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

  it('combines name search and minimum IQ as independent filters', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search scientists' }), 'i');
    await user.type(screen.getByRole('spinbutton', { name: 'Minimum IQ' }), '190');

    const names = within(screen.getByRole('list'))
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);

    expect(names).toEqual(['Albert Einstein', 'William Sidis', 'Isaac Newton']);
  });

  it('clears the numeric threshold when the input is emptied', async () => {
    const user = userEvent.setup();
    render(<App />);
    const minimumIQ = screen.getByRole('spinbutton', { name: 'Minimum IQ' });

    await user.type(minimumIQ, '210');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);

    await user.clear(minimumIQ);

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6);
  });

  it('commits exactly one render when one search character is typed', async () => {
    const user = userEvent.setup();
    const onRender = vi.fn();
    render(
      <Profiler id="directory" onRender={onRender}>
        <App />
      </Profiler>,
    );
    onRender.mockClear();

    await user.type(screen.getByRole('searchbox', { name: 'Search scientists' }), 'a');

    expect(onRender).toHaveBeenCalledTimes(1);
  });
});

describe('directory deletion and reset', () => {
  it('updates the polite live count as filters, deletion, and reset change results', async () => {
    const user = userEvent.setup();
    render(<App />);
    const status = screen.getByRole('status');
    const search = screen.getByRole('searchbox', { name: 'Search scientists' });

    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('6 scientists');

    await user.type(search, 'einstein');
    expect(status).toHaveTextContent('1 scientist');

    await user.click(screen.getByRole('button', { name: 'Delete Albert Einstein' }));
    expect(status).toHaveTextContent('0 scientists');

    await user.clear(search);
    expect(status).toHaveTextContent('5 scientists');

    await user.click(screen.getByRole('button', { name: 'Reset directory' }));
    expect(status).toHaveTextContent('6 scientists');
  });

  it('moves focus to the next stable delete control after deleting Johann Goethe', async () => {
    const user = userEvent.setup();
    render(<App />);
    const einsteinDeleteButton = screen.getByRole('button', { name: 'Delete Albert Einstein' });

    await user.click(screen.getByRole('button', { name: 'Delete Johann Goethe' }));

    expect(einsteinDeleteButton).toBeInTheDocument();
    expect(einsteinDeleteButton).toHaveFocus();
  });

  it('returns focus to search when deleting the only visible scientist', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('searchbox', { name: 'Search scientists' });

    await user.type(search, 'johann');
    await user.click(screen.getByRole('button', { name: 'Delete Johann Goethe' }));

    expect(search).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('0 scientists');
  });

  it('moves focus to the previous delete control when deleting the last result', async () => {
    const user = userEvent.setup();
    render(<App />);
    const maxwellDeleteButton = screen.getByRole('button', { name: 'Delete James Maxwell' });

    await user.click(screen.getByRole('button', { name: 'Delete Leonardo da Vinci' }));

    expect(maxwellDeleteButton).toHaveFocus();
  });

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
