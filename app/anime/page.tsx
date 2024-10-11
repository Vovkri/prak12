'use client'

import { useSearchParams } from "next/navigation";
import { getAnimeById } from "../service/requests";
import { useEffect, useState } from "react";
import styles from "@/app/animedetails.module.css"

type Item = {
    id: number;
    name: string;
    date: string;
    rating: string;
};
function getValue(): Item[] {
    const storedItems = localStorage.getItem('animeItems');
    return storedItems ? JSON.parse(storedItems) : [];
}
export default function Anime() {

    const [rating, setRating] = useState("1");
    const params = useSearchParams();
    const param = params.get('number');
    const [selectedAnime, setSelectedAnime] = useState<IAnimeData>();
    const [items, setItems] = useState<Item[]>(getValue());

    const addItemToLocalStorage = (id: number, name: string, date: string, rating: string) => {
        const existingItems = localStorage.getItem('animeItems');
        const itemsArray: Item[] = existingItems ? JSON.parse(existingItems) : [];
        const newItem: Item = { id, name, date, rating };
        const itemExists = itemsArray.some(item => item.id === id);

        if (itemExists) {
            alert("Этот элемент уже добавлен в список.");
            return;
        }

        const updatedItems = [...itemsArray, newItem];

        setItems(updatedItems);
        localStorage.setItem('animeItems', JSON.stringify(updatedItems));
    };

    function handleAddItem() {
        if (selectedAnime?.data.mal_id !== undefined) {
            addItemToLocalStorage(selectedAnime.data.mal_id, selectedAnime.data.title, new Date().toISOString().split('T')[0], rating);

        }
    }

    useEffect(() => {
        const fetchAnimes = async () => {
            if (param == undefined) {
                return;
            }
            const data = await getAnimeById(param);
            setSelectedAnime(data);
        };
        fetchAnimes();
    }, [param]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {selectedAnime !== undefined ? (
                    <div className={styles.animeInfo}>
                        <h2 className={styles.header}>{selectedAnime.data.title}</h2>
                        <p>Title English: {selectedAnime.data.title_english}</p>
                        <p>Title Japanese: {selectedAnime.data.title_japanese}</p>
                        <p>Score: {selectedAnime.data.score}</p>
                        <p>Rating: {selectedAnime.data.rating}</p>
                        <p>Scored by: {selectedAnime.data.scored_by}</p>

                        {selectedAnime.data.trailer.embed_url != undefined && (
                            <div className={styles.trailerContainer}>
                                <iframe
                                    width="330"
                                    height="200"
                                    src={selectedAnime.data.trailer.embed_url}
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                />
                                <div>
                                    Рейтинг ожидаемости<select className={styles.customSelect} value={rating} onChange={(e) => setRating(e.target.value)}>
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button className={styles.button} onClick={handleAddItem}>
                                        Добавить в посмотреть позже
                                    </button>
                                </div>
                            </div>
                        )}
                        <p>
                            Prodecers: {selectedAnime.data.producers ?
                                selectedAnime.data.producers.map(producers => producers.name).join(', ') :
                                'N/A'}
                        </p>
                        <p>
                            Genres: {selectedAnime.data.genres ?
                                selectedAnime.data.genres.map(genres => genres.name).join(', ') :
                                'N/A'}
                        </p>
                        <p>
                            Themes: {selectedAnime.data.themes ?
                                selectedAnime.data.themes.map(genre => genre.name).join(', ') :
                                'N/A'}
                        </p>
                        <p>Duration: {selectedAnime.data.duration}</p>
                        <p>Favorites: {selectedAnime.data.favorites}</p>
                        <p>Members: {selectedAnime.data.members}</p>
                        <p>
                            Aired: {selectedAnime.data.aired ?
                                selectedAnime.data.aired.string :
                                'N/A'}
                        </p>
                        <img
                            alt={selectedAnime.data.title}
                            className={styles.animeImage}
                            onClick={() => { }}
                            src={selectedAnime.data.images.jpg.image_url}
                        />

                    </div>
                ) : (
                    <h3>...</h3>
                )}

            </div>
        </div>
    );
}