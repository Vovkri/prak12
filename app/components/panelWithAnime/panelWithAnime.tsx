'use client'

import React, { useEffect, useState } from 'react';
import { getAnime } from '@/app/service/requests';
import styles from "@/app/page.module.css";

interface IRequestData {
    filters: {
        type: string;
        rating: string;
        status: string;
    };
    sort: string;
    numberPage: number,
    setNumberPage: (num: number) => void;
}

const handleClicke = (num: number) => {

    window.open(`/anime/?number=${num}`, '_blank');
}

export default function PanelAnime({ filters, sort, numberPage, setNumberPage }: IRequestData) {
    const [res, setRes] = useState<IResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(0);


    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (typeof window !== 'undefined') {
                const width = Math.floor(window.innerWidth / 335);
                const height = Math.floor(window.innerHeight / 430);
                setItemsPerPage(width * height);
            }
        };
        calculateItemsPerPage();

        window.addEventListener('resize', calculateItemsPerPage);
        const fetchAnimes = async () => {
            let request: string[] = [];

            if (sort !== 'default') request.push(`order_by=${sort}`);
            if (filters.rating !== 'default') request.push(`rating=${filters.rating}`);
            if (filters.status !== 'default') request.push(`status=${filters.status}`);
            if (filters.type !== 'default') request.push(`type=${filters.type}`);
            request.push("page=" + numberPage)
            console.log("Fetching with request:", request.join("&"));

            try {
                setLoading(true);
                const data = await getAnime(request.join("&"));
                console.log("API Response:", data);
                setRes(data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimes();
    }, [filters.type, filters.rating, filters.status, sort, numberPage]);

    const handleClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const totalPages = Math.ceil((res?.data?.length || 0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = res?.data?.slice(indexOfFirstItem, indexOfLastItem) || [];
    console.log(2)
    return (
        <div>
            {loading ? (
                <p>Загрузка...</p>
            ) : currentItems.length > 0 ? (
                <div>
                    <div className={styles.cardContainer}>
                        {currentItems.map(anime => (

                            <div key={anime.mal_id} className={styles.animeCard} onClick={() => handleClicke(anime.mal_id)}>
                                <img src={anime.images.jpg.large_image_url} alt={anime.title} className={styles.animeImage} />
                                <h3>{anime.title}</h3>
                                <p>Rating: {anime.rating}</p>
                                <p>Score: {anime.score}</p>
                                <p>Scored by: {anime.scored_by}</p>
                            </div>

                        ))}
                    </div>
                    <div className={styles.pagination}>
                        <button onClick={() => setNumberPage(numberPage - 1)} disabled={numberPage === 1} >
                            Назад
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handleClick(index + 1)}
                                className={currentPage === index + 1 ? styles.active : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => setNumberPage(numberPage + 1)} >
                            Загрузить еще
                        </button>
                    </div>
                </div>
            ) : (
                <p>Нет данных для отображения.</p>
            )}

        </div>
    );
}
