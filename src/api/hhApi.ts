// HeadHunter API client
import { baseApi } from './baseApi';

// Интерфейсы для типизации данных HeadHunter API
export interface HhVacancy {
  id: string;
  name: string;
  alternate_url: string;
  salary: {
    from: number | null;
    to: number | null;
    currency: string;
    gross: boolean;
  } | null;
  employer: {
    name: string;
    logo_urls?: {
      original?: string;
      '90'?: string;
    };
    alternate_url: string;
  };
  snippet: {
    requirement?: string;
    responsibility?: string;
  };
  schedule: {
    id: string;
    name: string;
  };
  experience: {
    id: string;
    name: string;
  };
  published_at: string;
  area: {
    id: string;
    name: string;
  };
}

export interface HhVacancyResponse {
  items: HhVacancy[];
  found: number;
  pages: number;
  per_page: number;
  page: number;
}

export interface HhSearchParams {
  text?: string;      // Поисковый запрос
  area?: string;      // Регион поиска (ID региона)
  salary?: number;    // Зарплата
  only_with_salary?: boolean; // Только с указанной зарплатой
  experience?: string; // Опыт работы
  employment?: string; // Тип занятости
  schedule?: string;  // График работы
  period?: number;    // Период поиска в днях
  page?: number;      // Номер страницы
  per_page?: number;  // Количество вакансий на странице
}

// Создаем API для работы с HeadHunter
export const hhApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Поиск вакансий
    searchVacancies: builder.query<HhVacancyResponse, HhSearchParams>({
      query: (params) => ({
        url: 'https://api.hh.ru/vacancies',
        params: {
          ...params,
          per_page: params.per_page || 20,
        },
        headers: {
          'User-Agent': 'JobSearchApp/1.0 (example@example.com)',
        },
      }),
      providesTags: ['Vacancies'],
    }),

    // Получение детальной информации о вакансии
    getVacancyById: builder.query<HhVacancy, string>({
      query: (id) => ({
        url: `https://api.hh.ru/vacancies/${id}`,
        headers: {
          'User-Agent': 'JobSearchApp/1.0 (example@example.com)',
        },
      }),
      providesTags: (_, __, id) => [{ type: 'Vacancy', id }],
    }),

    // Получение списка регионов (для фильтра)
    getAreas: builder.query<any[], void>({
      query: () => ({
        url: 'https://api.hh.ru/areas',
        headers: {
          'User-Agent': 'JobSearchApp/1.0 (example@example.com)',
        },
      }),
      providesTags: ['Areas'],
      // Cache for a day since this rarely changes
      keepUnusedDataFor: 86400,
    }),
    
    // Получение похожих вакансий
    getSimilarVacancies: builder.query<HhVacancyResponse, string>({
      query: (vacancyId) => ({
        url: `https://api.hh.ru/vacancies/${vacancyId}/similar_vacancies`,
        headers: {
          'User-Agent': 'JobSearchApp/1.0 (example@example.com)',
        },
      }),
      providesTags: (_, __, id) => [{ type: 'SimilarVacancies', id }],
    }),
    
    // Получение списка работодателей
    searchEmployers: builder.query<any, { text: string; page?: number; per_page?: number }>({
      query: (params) => ({
        url: 'https://api.hh.ru/employers',
        params,
        headers: {
          'User-Agent': 'JobSearchApp/1.0 (example@example.com)',
        },
      }),
      providesTags: ['Employers'],
    }),
    
    // Получение информации о работодателе
    getEmployerById: builder.query<any, string>({
      query: (id) => ({
        url: `https://api.hh.ru/employers/${id}`,
        headers: {
          'User-Agent': 'JobSearchApp/1.0 (example@example.com)',
        },
      }),
      providesTags: (_, __, id) => [{ type: 'Employer', id }],
    }),
  }),
  overrideExisting: false,
});

// Экспортируем хуки для использования в компонентах
export const {
  useSearchVacanciesQuery,
  useGetVacancyByIdQuery,
  useGetAreasQuery,
  useGetSimilarVacanciesQuery,
  useSearchEmployersQuery,
  useGetEmployerByIdQuery,
} = hhApi;

// Полезные константы для параметров API
export const HH_EXPERIENCE = {
  noExperience: 'noExperience',  // Нет опыта
  between1And3: 'between1And3',  // От 1 года до 3 лет
  between3And6: 'between3And6',  // От 3 до 6 лет
  moreThan6: 'moreThan6',        // Более 6 лет
};

export const HH_EMPLOYMENT = {
  full: 'full',        // Полная занятость
  part: 'part',        // Частичная занятость
  project: 'project',  // Проектная работа
  volunteer: 'volunteer', // Волонтерство
  probation: 'probation', // Стажировка
};

export const HH_SCHEDULE = {
  fullDay: 'fullDay',      // Полный день
  shift: 'shift',          // Сменный график
  flexible: 'flexible',    // Гибкий график
  remote: 'remote',        // Удаленная работа
  flyInFlyOut: 'flyInFlyOut', // Вахтовый метод
};
