import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UploadCloud, X, Plus, Video } from "lucide-react";  

const categories = [
  "Café da Manhã",
  "Sobremesa",
  "Massa",
  "Salada",
  "Vegetariana",
  "Fácil",
  "Prato Principal",
  "Lanche",
  "Low Carb",
  "Sem Lactose",
  "Frutos do Mar",
];

interface RecipeFormData {
  title: string;
  ingredients: string[];
  instructions: string;
  categories: string[];
  images: File[];
  video?: File;
  yield: string;
  visibility: "public" | "private";
}

export default function PublishRecipe() {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    ingredients: [],
    instructions: "",
    categories: [],
    images: [],
    yield: "",
    visibility: "public",
  });

  const [currentIngredient, setCurrentIngredient] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  }

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith("image/")) {
          alert(`"${file.name}" não é uma imagem válida.`);
          return false;
        }
        if (file.size > 100 * 1024 * 1024) {
          alert(`"${file.name}" excede 100MB.`);
          return false;
        }
        return true;
      });

      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...validFiles] 
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert("Por favor, selecione um arquivo de vídeo válido.");
        return;
      }
      
      if (file.size > 500 * 1024 * 1024) {
        alert("O vídeo excede o tamanho máximo de 500MB.");
        return;
      }

      setFormData(prev => ({ ...prev, video: file }));
    }
  };

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, video: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        alert("Por favor, insira um título para a receita.");
        return;
      }
      if (formData.ingredients.length === 0 || formData.ingredients.every(ing => !ing.trim())) {
        alert("Por favor, insira pelo menos um ingrediente.");
        return;
      }
      if (!formData.instructions.trim()) {
        alert("Por favor, insira o modo de preparo.");
        return;
      }

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("instructions", formData.instructions);
      submitData.append("yield", formData.yield);
      submitData.append("visibility", formData.visibility);

      formData.ingredients.forEach(ingredient => {
        submitData.append('ingredients', ingredient);
      });

      formData.categories.forEach(category => {
        submitData.append('categories', category);
      });

      formData.images.forEach((image, index) => {
        submitData.append('images', image);
      });

      if (formData.video) {
        submitData.append('video', formData.video);
      }

      // TODO: Chamada de API
      console.log("Dados para enviar:", {
        title: formData.title,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        categories: formData.categories,
        yield: formData.yield,
        visibility: formData.visibility,
        images: formData.images.map(img => img.name),
        video: formData.video?.name,
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // const response = await fetch('/api/recipes', {
      //   method: 'POST',
      //   body: submitData
      // });
      
      // if (response.ok) {
      //   const newRecipe = await response.json();
      //   // Redirecionar para a receita criada
      //   window.location.href = `/receita/${newRecipe.id}`;
      // } else {
      //   throw new Error('Erro ao publicar receita');
      // }

      alert("Receita publicada com sucesso!");

      //<Navigate to="/receita" replace />;
    } catch (error) {
      console.error("Erro ao publicar receita:", error);
      alert("Ocorreu um erro ao publicar a receita. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-blue flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <h1 className="text-5xl font-bold text-black mb-12">Publicar Receita</h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-[564px] bg-white rounded-xl p-3 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Título *
            </label>
            <input
              type="text"
              placeholder="Ex: Bolo de Chocolate..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-4 rounded-lg border border-black/30 text-base font-medium tracking-tight placeholder:text-black/40 placeholder:opacity-40 focus:outline-none focus:border-black/50"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Ingredientes *
            </label>
            <div className="flex flex-col gap-2 mb-3">
              {formData.ingredients.filter(ing => ing.trim()).map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="flex-1 text-base">{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: 2 xícaras de farinha de trigo"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-black/30 text-base placeholder:text-black/40 focus:outline-none focus:border-dark-brown"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-3 bg-dark-brown text-white rounded-lg hover:bg-dark-brown/90 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Modo de Preparo *
            </label>
            <textarea
              placeholder="Descreva passo a passo como preparar a receita..."
              rows={6}
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-4 py-4 rounded-lg border border-black/30 text-base font-medium tracking-tight placeholder:text-black/40 focus:outline-none focus:border-dark-brown resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Categorias *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleCategory(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.categories.includes(tag)
                      ? "bg-dark-brown text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.categories.length > 0 && (
              <p className="text-sm text-gray-600">
                Categorias selecionadas: {formData.categories.join(', ')}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Imagens
            </label>

            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-dark-brown bg-dark-brown/8 flex items-center justify-center cursor-pointer hover:bg-dark-brown/12 transition-colors">
              <label htmlFor="image-upload" className="cursor-pointer text-center">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-8 h-8 text-black/50" />
                  <p className="text-lg font-semibold text-black/50">
                    {formData.images.length > 0 
                      ? `Adicionar mais imagens (${formData.images.length} selecionadas)`
                      : 'Clique para adicionar imagens'
                    }
                  </p>
                  <p className="text-sm text-black/30">
                    PNG, JPG até 100MB cada
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Vídeo da Receita (opcional)
            </label>
            
            {formData.video ? (
              <div className="relative">
                <video 
                  src={URL.createObjectURL(formData.video)}
                  controls
                  className="w-full h-48 rounded-lg object-cover bg-black"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full h-32 rounded-2xl border-2 border-dashed border-blue-500 bg-blue-500/8 flex items-center justify-center cursor-pointer hover:bg-blue-500/12 transition-colors">
                <label htmlFor="video-upload" className="cursor-pointer text-center">
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Video className="w-6 h-6 text-blue-500" />
                    <p className="text-sm font-semibold text-blue-500">
                      Adicionar Vídeo
                    </p>
                    <p className="text-xs text-blue-400">
                      MP4, MOV até 500MB
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Rendimento (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: 4 porções, 1 bolo grande, 12 unidades"
              value={formData.yield}
              onChange={(e) => setFormData(prev => ({ ...prev, yield: e.target.value }))}
              className="w-full px-4 py-4 rounded-lg border border-black/30 text-base font-medium tracking-tight placeholder:text-black/40 focus:outline-none focus:border-dark-brown"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-black/60 uppercase tracking-tight">
              Visibilidade
            </label>
            <div className="flex items-center p-1 rounded-full bg-card-gray w-fit">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visibility: "public" }))}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  formData.visibility === "public"
                    ? "bg-dark-brown text-white shadow-sm"
                    : "bg-transparent text-dark-brown"
                }`}
              >
                Público
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visibility: "private" }))}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  formData.visibility === "private"
                    ? "bg-dark-brown text-white shadow-sm"
                    : "bg-transparent text-dark-brown"
                }`}
              >
                Privado
              </button>
            </div>
          </div>

          <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-5 py-3.5 bg-dark-brown text-white rounded-lg font-bold text-base hover:bg-dark-brown/90 transition-colors">
            {isSubmitting ? 'Publicando...' : 'Publicar Receita'}
          </button>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}
