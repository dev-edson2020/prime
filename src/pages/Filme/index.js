import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import api from "../../services/api";
import './filme-info.css'

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilme() {
            await api.get(`/movie/${id}`, {
                params: {
                    api_key: "73805756955a430b44e6490c239d5cd7",
                    language: "pt-BR",
                }
            })
                .then((response) => {
                    setFilme(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    toast.warning('Filme não encontrado');
                    navigate('/', { replace: true });
                    return;
                })
        }
        loadFilme();
    }, [navigate, id])

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix");
        let filmesSalvos = JSON.parse(minhaLista) || [];
        const hasFilme = filmesSalvos.some((filmesSalvo) => filmesSalvo.id === filme.id);
        if (hasFilme) {
            toast.warning('Este filme já está na sua lista')
            return;
        }
        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success('Filme salvo com sucesso!');
    }


    if (loading) {
        return (
            <div className="filme-info">
                <h2>Carregando detalhes do filme...</h2>
            </div>
        )
    }

    return (
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`http://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} />

            <h3>Sinopse</h3>
            <h1>{filme.overview}</h1>

            <strong>Avaliação: {filme.vote_average} / 10 </strong>

            <div className="area-buttons">
                <button onClick={salvarFilme}> Salvar </button>
                <button>
                    <a target="blank" rel="external noreferrer" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>

        </div>
    )
}

export default Filme;