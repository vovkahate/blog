import axios from 'axios';

class FetchService {
    static PAGE_SIZE = 5;

    async getFivePosts(offset) {
        const response = await axios.get(
            `https://blog.kata.academy/api/articles?offset=${offset}&limit=${FetchService.PAGE_SIZE}`
        );
        console.log(response.data);
        return response.data;
    }

    async fetchData(pageNumber) {
        const offset = (pageNumber - 1) * FetchService.PAGE_SIZE;
        return await this.getFivePosts(offset);
    }
}

export default new FetchService();
