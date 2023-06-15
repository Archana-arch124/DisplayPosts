import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PostsDisplay from '../Posts/postsDisplay';

const mockAxios = new MockAdapter(axios);

describe('PostsDisplay', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('displays posts fetched from API', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' },
    ];

    mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, mockPosts);

    render(<PostsDisplay />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Body 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
      expect(screen.getByText('Body 2')).toBeInTheDocument();
    });
  });

  test('displays error message when API request fails', async () => {
    mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(500, 'Internal Server Error');

    render(<PostsDisplay />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Error: Internal Server Error')).toBeInTheDocument();
    });
  });

  test('filters posts by title', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' },
    ];
    mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, mockPosts);

    render(<PostsDisplay />);


    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search posts');

    expect(searchInput).toBeInTheDocument();

    // Searching for 'Post 1'
    await waitFor(() => {
      searchInput.value = 'Post 1';
      fireEvent.change(searchInput);
    });

    expect(screen.getByText('Post 1')).toBeInTheDocument();
    
    expect(screen.queryByText('Post 2')).not.toBeInTheDocument();
  });
});
