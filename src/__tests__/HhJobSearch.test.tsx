import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from '@reduxjs/toolkit/dist/configureStore';
import HhJobSearch from '../components/HhJobSearch';

// Mock the RTK Query hooks
jest.mock('../api/hhApi', () => ({
  useGetAreasQuery: jest.fn(),
  useSearchVacanciesQuery: jest.fn(),
  hhApi: {
    endpoints: {
      searchVacancies: { useQuery: jest.fn() },
      getAreas: { useQuery: jest.fn() }
    }
  }
}));

// Import the mocked modules
import { useGetAreasQuery, useSearchVacanciesQuery } from '../api/hhApi';

// Mock data
const mockAreas = [
  {
    id: '113',
    name: 'Россия',
    areas: [
      { id: '1', name: 'Москва', areas: [] },
      { id: '2', name: 'Санкт-Петербург', areas: [] }
    ]
  }
];

const mockVacancies = {
  found: 123,
  pages: 3,
  per_page: 10,
  page: 0,
  items: [
    {
      id: '123456',
      name: 'React Developer',
      alternate_url: 'https://hh.ru/vacancy/123456',
      salary: { from: 100000, to: 150000, currency: 'RUR' },
      employer: { 
        name: 'Test Company', 
        logo_urls: { '90': 'https://example.com/logo.png' } 
      },
      published_at: '2025-09-08T14:30:00+0300',
      snippet: {
        requirement: 'TypeScript, React, Redux',
        responsibility: 'Разработка пользовательских интерфейсов'
      },
      area: { name: 'Москва' },
      experience: { name: '1–3 года' },
      schedule: { name: 'Удаленная работа' }
    }
  ]
};

// Mock store
const mockStore = configureStore({
  reducer: {
    api: (state = {}) => state
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

// Test wrapper component
const renderWithProviders = (ui) => {
  return render(
    <Provider store={mockStore}>
      {ui}
    </Provider>
  );
};

describe('HhJobSearch Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useGetAreasQuery as jest.Mock).mockReturnValue({
      data: mockAreas,
      isLoading: false,
      error: null
    });
    
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn()
    });
  });

  test('renders search form correctly', () => {
    renderWithProviders(<HhJobSearch />);
    
    // Check that key form elements are present
    expect(screen.getByLabelText(/ключевые слова/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/регион/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /найти вакансии/i })).toBeInTheDocument();
  });

  test('shows loading state for areas', () => {
    (useGetAreasQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });
    
    renderWithProviders(<HhJobSearch />);
    
    expect(screen.getByText(/загрузка регионов/i)).toBeInTheDocument();
  });

  test('shows error state for areas', () => {
    (useGetAreasQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to load areas' }
    });
    
    renderWithProviders(<HhJobSearch />);
    
    expect(screen.getByText(/ошибка загрузки регионов/i)).toBeInTheDocument();
  });

  test('submits search form', async () => {
    const refetchMock = jest.fn();
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: refetchMock
    });
    
    const user = userEvent.setup();
    renderWithProviders(<HhJobSearch />);
    
    // Fill form fields
    await user.type(screen.getByLabelText(/ключевые слова/i), 'React');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /найти вакансии/i }));
    
    // Check if refetch was called
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  test('displays search results', () => {
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: mockVacancies,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn()
    });
    
    renderWithProviders(<HhJobSearch />);
    
    // Check that results are displayed
    expect(screen.getByText('React Developer')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText(/от 100 000 до 150 000 ₽/i)).toBeInTheDocument();
  });

  test('displays loading state for search', () => {
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: jest.fn()
    });
    
    renderWithProviders(<HhJobSearch />);
    
    expect(screen.getByText(/загрузка вакансий/i)).toBeInTheDocument();
  });

  test('displays error state for search', () => {
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: { message: 'Failed to load vacancies' },
      refetch: jest.fn()
    });
    
    renderWithProviders(<HhJobSearch />);
    
    expect(screen.getByText(/ошибка загрузки вакансий/i)).toBeInTheDocument();
  });

  test('displays empty results message', () => {
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: { ...mockVacancies, items: [], found: 0 },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn()
    });
    
    renderWithProviders(<HhJobSearch />);
    
    expect(screen.getByText(/по вашему запросу ничего не найдено/i)).toBeInTheDocument();
  });

  test('handles pagination', async () => {
    const refetchMock = jest.fn();
    (useSearchVacanciesQuery as jest.Mock).mockReturnValue({
      data: mockVacancies,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: refetchMock
    });
    
    const user = userEvent.setup();
    renderWithProviders(<HhJobSearch />);
    
    // Click on next page button
    const nextPageButton = screen.getByRole('button', { name: /следующая/i });
    await user.click(nextPageButton);
    
    // Since state updates are hard to test directly, we check if refetch was called
    // This indicates the pagination action took place
    expect(refetchMock).toHaveBeenCalled();
  });

  test('toggles salary filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HhJobSearch />);
    
    // Find and click the salary checkbox
    const salaryCheckbox = screen.getByLabelText(/только с указанной зарплатой/i);
    await user.click(salaryCheckbox);
    
    // Check if checkbox state changed
    expect(salaryCheckbox).not.toBeChecked();
  });
});