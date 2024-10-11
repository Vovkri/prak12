'use client'
import React, { useEffect, useState } from 'react';
import styles from './Seelater.module.css';

interface Item {
    id: number;
    date: string;
    rating: string;
    name: string;
}

const Seelater: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const storedItems = localStorage.getItem('animeItems');
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }

        const handleResize = () => {
            const height = Math.floor((window.innerHeight - 250) / 70);
            setItemsPerPage(height);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClicke = (id: number) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        localStorage.setItem('animeItems', JSON.stringify(updatedItems));
    };

    const sortByDate = () => {
        const sortedItems = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setItems(sortedItems);
        setCurrentPage(1);
    };

    const sortByRating = () => {
        const sortedItems = [...items].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        setItems(sortedItems);
        setCurrentPage(1);
    };

    const sortByRatingAndDate = () => {
        const sortedItems = [...items].sort((a, b) => {
            const ratingComparison = parseFloat(b.rating) - parseFloat(a.rating);
            if (ratingComparison !== 0) {
                return ratingComparison;
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setItems(sortedItems);
        setCurrentPage(1);
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className={styles.container}>
            <h1>Список посмотреть позже</h1>
            <div>
                <button onClick={sortByDate} className={styles.sortButton}>Сортировать по дате</button>
                <button onClick={sortByRating} className={styles.sortButton}>Сортировать по рейтингу</button>
                <button onClick={sortByRatingAndDate} className={styles.sortButton}>Сортировать по рейтингу и дате</button>
            </div>
            <ul className={styles.itemsList}>
                {currentItems.length > 0 ? (
                    currentItems.map(item => (
                        <li key={item.id}>
                            Id: {item.id}, Name: {item.name}, Date: {item.date}, Rating: {item.rating}
                            <button onClick={() => handleClicke(item.id)} className={styles.sortButton}>
                                Удалить
                            </button>
                        </li>
                    ))
                ) : (
                    <li>Нет добавленных элементов.</li>
                )}
            </ul>
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Назад
                    </button>
                    <span>Страница {currentPage} из {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Вперед
                    </button>
                </div>
            )}

        </div>
    );
};

export default Seelater;