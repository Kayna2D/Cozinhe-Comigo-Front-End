import { useState, useEffect } from "react";
import Header from "@/components/Header";
import UnloggedHeader from "@/components/UnloggedHeader";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Search } from "lucide-react";
import { Recipe } from "@/types/recipe";

const categories = [
  { label: "Todas as receitas", value: "all" },
  { label: "Prato principal", value: "main" },
  { label: "Sobremesas", value: "dessert" },
  { label: "Massas", value: "pasta" },
  { label: "Saladas", value: "salad" },
  { label: "Vegetariana", value: "vegetarian" },
  { label: "Fácil", value: "easy" },
  { label: "Lanche", value: "snack" },
  { label: "Low Carb", value: "lowcarb" },
  { label: "Sem Lactose", value: "lactosefree" },
  { label: "Frutos do Mar", value: "seafood" },
  { label: "Café da Manhã", value: "breakfast" },

];

const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Bife Grelhado",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 5,
    author: {
      id: "user1",
      name: "Rafaela Dutra",
      email: "rafaela@email.com"
    },
    tags: ["main", "easy", "lowcarb"],
  },
  {
    id: "2",
    title: "Pão Torrado",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.7,
    author: {
      id: "user2",
      name: "Tomás Valladares",
      email: "tomas@email.com"
    },
    tags: ["breakfast", "snack", "vegetarian"],
  },
  {
    id: "3",
    title: "Bolo de Framboesa",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.8,
    author: {
      id: "user3",
      name: "Monique Bueno",
      email: "monique@email.com"
    },
    tags: ["dessert", "vegetarian"],
  },
  {
    id: "4",
    title: "Macarrão Cozido",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.8,
    author: {
      id: "user1",
      name: "Rafaela Dutra",
      email: "rafaela@email.com"
    },
    tags: ["main", "pasta", "seafood"],
  },
  {
    id: "5",
    title: "Salada de Vegetais",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.6,
    author: {
      id: "user1",
      name: "Rafaela Dutra",
      email: "rafaela@email.com"
    },
    tags: ["salad", "vegetarian", "easy"],
  },
  {
    id: "6",
    title: "Carne de Porco",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.5,
    author: {
      id: "user4",
      name: "José Luiz",
      email: "jose@email.com"
    },
    tags: ["main", "easy"],
  },
  {
    id: "7",
    title: "Salmão Ensopado",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.1,
    author: {
      id: "user5",
      name: "Adriana Germano",
      email: "adrian@email.com"
    },
    tags: ["main", "seafood", "lowcarb"],
  },
  {
    id: "8",
    title: "Hambúrguer",
    image: "https://images.unsplash.com/photo-1612690119274-8819a81c13a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    rating: 4.5,
    author: {
      id: "user1",
      name: "Rafaela Dutra",
      email: "rafaela@email.com"
    },
    tags: ["main", "easy" ],
  },
];

export default function Index() {
  const [activeTag, setActiveTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  //const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      // TODO: Substituir por API real
      // const response = await fetch('/api/recipes');
      // const data = await response.json();
      
      setTimeout(() => {
        setRecipes(mockRecipes);
        setLoading(false);
      }, 500);
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesTag = activeTag === "all" || recipe.tags.includes(activeTag);
    
    const matchesSearch = searchTerm === "" || 
                         recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => 
                           tag.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-sky-blue flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold text-black mb-10">Receitas</h1>
        
        <div className="bg-card-gray rounded-2xl px-4 py-2.5 flex items-center gap-2 max-w-[270px] mb-10">
          <Search className="w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-semibold text-black placeholder:text-black w-full"
          />
        </div>
        
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveTag(category.value)}
                className={`px-4 py-3 rounded-full text-base font-medium tracking-tight transition-colors ${
                  activeTag === category.value
                    ? "bg-black text-white"
                    : "bg-dark-brown text-white hover:bg-dark-brown/90"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-brown"></div>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="text-sm text-gray-600">
                {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
                {activeTag !== "all" && ` na categoria "${categories.find(t => t.value === activeTag)?.label}"`}
                {searchTerm && ` para "${searchTerm}"`}
              </div>
              
              {/* Grid de receitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image}
                    rating={recipe.rating}
                    author={recipe.author.name}
                    tags={recipe.tags}
                  />
                ))}
              </div>
              
              {/* Mensagem de lista vazia */}
              {filteredRecipes.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-600 mb-4">
                    {searchTerm || activeTag !== "all" 
                      ? "Nenhuma receita encontrada para os filtros aplicados." 
                      : "Nenhuma receita disponível no momento."}
                  </p>
                  {(searchTerm || activeTag !== "all") && (
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setActiveTag("all");
                      }}
                      className="px-4 py-2 bg-dark-brown text-white rounded-lg hover:bg-light-brown transition-colors"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
