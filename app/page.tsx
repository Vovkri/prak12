'use client'

import React, { useState} from "react";
import PanelAnime from "./components/panelWithAnime/panelWithAnime";
import styles from "./style.module.css"

const sorts: { [key: string]: string } = {
  "Без сортировки": "default",
  "Популярность": "popularity",
  "Оценка": "score",
  "Количество оценок": "members",
  "Количество favorits": "favorites",
  "Количество эпизодов": "episodes",
  "Сортировка по датам": "start_date"
};

const filters_types: { [key: string]: string } = {
  "Любой тип": "default",
  "Телевизионные": "tv",
  "Кинемотограф": "movie",
  "Оригинальная видео-анимация": "ova",
  "Доп контент": "special",
  "Оригинальная сетевая анимация": "ona",
  "Музыкальные": "music",
  "Коммерческие": "cm",
  "Рекламные": "pv",
  "Телевизионные доп контент": "tv_special"
};

const filters_ratings: { [key: string]: string } = {
  "Любой возраст": "default",
  "Все возраста": "g",
  "Детское": "pg",
  "13+": "pg13",
  "17+": "r17",
  "Взрослое (R)": "r",
  "Хентай": "rx"
};

const filters_statuses: { [key: string]: string } = {
  "Любой статус": "default",
  "В эфире": "airing",
  "Завершен": "complete",
  "Скоро выходит": "upcoming"
};
const handleClicke = () => {

  window.open(`/seelater`, '_blank');
}
export default function Home() {
  const [sort, setSort] = useState<string>(sorts["Без сортировки"]);
  const [filters_type, setFilters_type] = useState<string>(filters_types["Любой тип"]);
  const [filters_rating, setFilters_rating] = useState<string>(filters_ratings["Любой возраст"]);
  const [filters_status, setFilters_status] = useState<string>(filters_statuses["Любой статус"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [numberPage, setNumberPage] = useState<number>(1)

  const handleChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value);
    setLoading(true);
  };

  const handleChangeFilters_types = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters_type(event.target.value);
    setLoading(true);
  };

  const handleChangeFilters_ratings = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters_rating(event.target.value);
    setLoading(true);
  };

  const handleChangeFilters_statuses = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters_status(event.target.value);
    setLoading(true);
  };

  console.log(1)
  return (
    <div className={styles.filterContainer}>
      <select className={styles.filterSelect} id="sort" onChange={handleChangeSort}>
        {Object.keys(sorts).map((key) => (
          <option key={key} value={sorts[key]}>{key}</option>
        ))}
      </select>

      <select className={styles.filterSelect} id="filters_types" onChange={handleChangeFilters_types}>
        {Object.keys(filters_types).map((key) => (
          <option key={key} value={filters_types[key]}>{key}</option>
        ))}
      </select>

      <select className={styles.filterSelect} id="filters_rating" onChange={handleChangeFilters_ratings}>
        {Object.keys(filters_ratings).map((key) => (
          <option key={key} value={filters_ratings[key]}>{key}</option>
        ))}
      </select>

      <select className={styles.filterSelect} id="filters_status" onChange={handleChangeFilters_statuses}>
        {Object.keys(filters_statuses).map((key) => (
          <option key={key} value={filters_statuses[key]}>{key}</option>
        ))}
      </select>
      <button onClick={handleClicke} className={styles.buttonmore}>
        Показать список
      </button>

      <PanelAnime {...{ filters: { type: filters_type, rating: filters_rating, status: filters_status }, sort: sort, numberPage: numberPage, setNumberPage: setNumberPage }} />
    </div>

  );
}

