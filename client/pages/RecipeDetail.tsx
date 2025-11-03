import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { ArrowLeft, Download, Heart, Star, Play, Pause } from "lucide-react";

// Dados vem do backend (exemplo estático aqui)
interface Recipe {
  id: string; 
  title: string;
  category: string;
  categoryColor: string;
  datePosted: string;
  author: {
    id: string;
    name: string;
    rating: number;
    avatar: string;
  };
  images: string[];
  video?: string;
  ingredients: string;
  preparation: string;
  yield: string;
  visibility: "public" | "private";
  averageRating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timeAgo: string;
  rating: number;
  comment: string;
  createdAt: string;
}




export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        // TODO: Substituir pela chamada real da API
        const response = await fetch(`/api/recipes/${id}`);
        if (response.ok) {
          const recipeData = await response.json();
          setRecipe(recipeData);
        } else {
          throw new Error('Receita não encontrada');
        }
      } catch (error) {
        console.error('Erro ao carregar receita:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        // TODO: Substituir pela chamada real da API
        const response = await fetch(`/api/recipes/${id}/reviews`);
        if (response.ok) {
          const reviewsData = await response.json();
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      }
    };

    if (id) {
      fetchRecipe();
      fetchReviews();
    }
  }, [id]);

  const handleSubmitReview = async () => {
    if (!recipe || userRating === 0 || !userComment.trim()) {
      alert('Por favor, preencha a avaliação e o comentário');
      return;
    }

    try {
      setIsSubmittingReview(true);
      console.log('Enviando avaliação:', {
        rating: userRating,
        comment: userComment.trim()
      });
      
      // TODO: Substituir pela chamada real da API
      const response = await fetch(`/api/recipes/${recipe.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment.trim()
        })
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews(prev => [newReview, ...prev]);
        setUserRating(0);
        setUserComment('');
        alert('Avaliação enviada com sucesso!');
      } else {
        throw new Error('Erro ao enviar avaliação');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const toggleVideoPlayback = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  useEffect(() => {
    if (!recipe) {
      setRecipe({
        id: "1",
        title: "Bife Grelhado",
        category: "Prato principal",
        categoryColor: "#8673A1",
        datePosted: "13/10/2025",
        author: {
          id: "1",
          name: "Rafaela Dutra",
          rating: 4.9,
          avatar: "https://marketplace.canva.com/Dz63E/MAF4KJDz63E/1/tl/canva-user-icon-MAF4KJDz63E.png",
        },
        images: [
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
        ],
        video: "https://example.com/video.mp4", // URL do vídeo
        ingredients: `2 bifes de contrafilé (200g cada)
2 colheres de sopa de azeite de oliva
4 dentes de alho amassados
1 colher de chá de sal marinho
½ colher de chá de pimenta do reino moída na hora
1 colher de chá de alecrim fresco picado
1 colher de chá de tomilho fresco
2 cenouras médias descascadas e cortadas em rodelas
1 abobrinha média cortada em cubos
1 pimentão vermelho cortado em tiras
1 cebola roxa cortada em oito partes
2 colheres de sopa de azeite de oliva
1 colher de chá de sal
½ colher de chá de páprica defumada
Raminhos de alecrim fresco para finalizar`,
        preparation: `Preaqueça o forno a 200°C.
Em uma tigela grande, misture todos os legumes cortados com o azeite, sal e páprica.
Espalhe os legumes em uma assadeira grande, formando uma camada uniforme.
Asse por 20-25 minutos, ou até que os legumes estejam dourados e macios, virando na metade do tempo.

Enquanto os legumes assam, tempere os bifes com alho, sal, pimenta, alecrim e tomilho. Deixe marinar por 5 minutos.
Aqueça uma frigideira ou grelha em fogo alto com 1 colher de azeite.
Grelhe os bifes por 3-4 minutos de cada lado para um ponto ao médio, ou ajuste conforme preferência.
Retire do fogo e deixe descansar por 2-3 minutos antes de servir.

Distribua os legumes assados em dois pratos.
Coloque um bife grelhado sobre os legumes em cada prato.
Finalize com um fio de azeite e raminhos de alecrim fresco.
Sirva imediatamente.`,
        yield: "2 porções",
        visibility: "public",
        averageRating: 4.8,
        reviewCount: 24
      });
    }
  }, [recipe]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sky-blue flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">Carregando receita...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-sky-blue flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">Receita não encontrada</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-blue flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[956px] w-full mx-auto px-6 py-10">
        <div className="bg-white rounded-lg p-3 flex flex-col gap-12">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-dark-brown" strokeWidth={1.5} />
            <span className="text-base font-bold text-dark-brown underline">
              Voltar
            </span>
          </button>

          {/* Cabeçalho da Receita */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span
                className="px-2 py-1 rounded-full text-xs font-medium text-white tracking-tight"
                style={{ backgroundColor: recipe.categoryColor }}
              >
                {recipe.category}
              </span>
              <span className="text-xs font-medium text-black/50 tracking-tight">
                Postada em: {recipe.datePosted}
              </span>
            </div>

            <h1 className="text-5xl font-bold text-black">{recipe.title}</h1>

            <div className="flex items-center gap-4 bg-dark-brown rounded-lg p-2.5 w-fit">
              <div
                className="w-16 h-16 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.author.avatar})` }}
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight">
                  {recipe.author.name}
                </span>
                <span className="text-base text-white/60 tracking-tight">
                  ⭐ {recipe.author.rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Galeria de Mídia */}
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-[424px] bg-dark-brown rounded-lg p-4 flex flex-col items-center gap-2">
              {/* Vídeo (se existir) */}
              {recipe.video && (
                <div className="w-full mb-4 relative">
                  <video 
                    src={recipe.video}
                    controls
                    className="w-full h-48 rounded-lg object-cover bg-black"
                  />
                </div>
              )}
              
              {/* Carrossel de Imagens */}
              {recipe.images.length > 0 && (
                <>
                  <div className="w-full overflow-hidden">
                    <div
                      className="flex transition-transform duration-300"
                      style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                      {recipe.images.map((img, index) => (
                        <div
                          key={index}
                          className="w-full flex-shrink-0 px-3"
                        >
                          <div
                            className="w-full h-48 rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Indicadores do Carrossel */}
                  {recipe.images.length > 1 && (
                    <div className="flex items-center gap-2 py-4">
                      {recipe.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-black w-4 h-4"
                              : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Conteúdo da Receita */}
            <div className="w-full flex flex-col gap-8">
              <div>
                <h2 className="text-[34px] font-bold text-black mb-4">Ingredientes</h2>
                <p className="text-base leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Merriweather, serif' }}>
                  {recipe.ingredients}
                </p>
              </div>

              <div>
                <h2 className="text-[34px] font-bold text-black mb-4">Modo de Preparo</h2>
                <p className="text-base leading-relaxed whitespace-pre-line opacity-65 font-bold" style={{ fontFamily: 'Merriweather, serif' }}>
                  {recipe.preparation}
                </p>
              </div>

              {recipe.yield && (
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Rendimento</h3>
                  <p className="text-base">{recipe.yield}</p>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => alert('Função de exportar ainda não implementada')}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-dark-brown text-white rounded-lg font-bold text-base hover:bg-dark-brown/90 transition-colors"
                >
                  Exportar
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert('Função de salvar ainda não implementada')}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-dark-brown text-white rounded-lg font-bold text-base hover:bg-dark-brown/90 transition-colors"
                >
                  Salvar
                  <Heart className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-3.5 bg-dark-brown text-white rounded-lg font-bold text-base hover:bg-dark-brown/90 transition-colors">
                  Avaliar
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Avaliações */}
        <h2 className="text-2xl font-bold text-black my-10">
          Avaliações ({recipe.reviewCount})
        </h2>

        {/* Lista de Avaliações */}
        <div className="flex flex-col gap-6 mb-10">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-[32px_32px_32px_0] shadow-lg p-6 flex gap-5"
            >
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${review.author.avatar})` }}
              />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {review.author.name}
                  </span>
                  <span className="text-lg text-gray-400" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {review.timeAgo}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <StarRating rating={review.rating} size={40} />
                  <span className="text-xl font-semibold">
                    <span className="text-yellow-400">{review.rating}</span>
                    <span className="text-gray-400">/5</span>
                  </span>
                </div>
                <p className="text-base text-gray-900/60 leading-normal" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulário de Avaliação */}
        <div id="avaliacao" className="bg-white border-2 border-black/40 p-3 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <StarRating 
              rating={userRating} 
              interactive 
              onRate={setUserRating}
            />
            <span className="text-xl font-semibold text-black/70">Avalie</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Comentário
            </label>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Digite aqui..."
              rows={6}
              className="w-full px-4 py-4 rounded-lg border border-black/30 text-base font-medium tracking-tight placeholder:text-black/40 placeholder:opacity-40 focus:outline-none focus:border-black/50 resize-none"
            />
          </div>

          <button 
            onClick={handleSubmitReview}
            disabled={isSubmittingReview}
            className="w-full px-5 py-3.5 bg-dark-brown text-white rounded-lg font-bold text-base hover:bg-dark-brown/90 transition-colors disabled:opacity-50"
          >
            {isSubmittingReview ? 'Enviando...' : 'Avaliar'}
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
