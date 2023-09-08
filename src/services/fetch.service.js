import axios from 'axios';

class FetchService {
    static PAGE_SIZE = 5;

    async getFivePosts(offset) {
        const response = await axios.get(
            `https://blog.kata.academy/api/articles?offset=${offset}&limit=${FetchService.PAGE_SIZE}`
        );
        console.log('запрос 5 статей из сервиса', response.data);
        return response.data;
    }

    async fetchData(pageNumber) {
        const offset = (pageNumber - 1) * FetchService.PAGE_SIZE;
        return await this.getFivePosts(offset);
    }

    async fetchFavorited(bearer, name) {
        const response = await axios.get(
            `https://blog.kata.academy/api/articles?favorited=${name}`,

            {
                headers: {
                    Authorization: `Bearer ${bearer}`,
                },
            }
        );
        console.log('запрос списка лайков', response.data);

        return response.data;
    }
}

export default new FetchService();
