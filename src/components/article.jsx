import { useParams } from 'react-router-dom';

const Article = () => {
    const { id } = useParams();
    return <div>id: {id}</div>;
};

export default Article;
