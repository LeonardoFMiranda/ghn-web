# 📰 GitHub News

Um portal de notícias moderno feito em **React + TypeScript**, com busca, categorias, favoritos, destaques, scroll infinito e layout responsivo.

---

## 🚀 Instalação e Execução

1. **Clone o repositório**

   ```bash
   git clone https://github.com/LeonardoFMiranda/ghn-web.git
   ```
   ```bash
   cd news-app
   ```
   ```bash
   npm install
   ```
   
3. **Instale as dependências**
   ```bash
   npm install
   ```

5. Configure a chave da NewsAPI
   Crie um arquivo .env na raiz do projeto e adicione:
   ```bash
   VITE_API_KEY=sua_chave_aqui
   ```

7. Execute o app
   ```bash
   npm run dev
   ```
   O app estará disponível em:
   http://localhost:5173 (ou na porta indicada pelo terminal)

## ✨ Principais Funcionalidades

- 🔍 **Busca de notícias** com scroll infinito  
- 📰 **Destaque para as 3 principais notícias** em um grid especial  
- 📑 **Lista horizontal** para as demais notícias (imagem 1/3 + detalhes 2/3)  
- ⭐ **Favoritos persistentes** via `localStorage`  
- 📂 **Categorias** com menu lateral (sidebar) estilizado e as principais no header 
- 📱 **Responsivo** para desktop e mobile  
- ⏳ **Spinner de loading** e feedback visual para ausência de resultados  

---

## 🛠️ Decisões Técnicas

- **React + TypeScript** → Tipagem forte e melhor manutenção  
- **Componentização** → Componentes reutilizáveis como `MainNewsGrid` e `NewsListHorizontal` para replicar layouts  
- **NewsAPI** → Consumo da API pública, com filtro de idioma e domínios indesejados  
- **CSS Modules** → Estilos isolados para evitar conflitos  
- **Scroll infinito** → Implementado via evento de scroll + paginação da API  
- **Persistência de favoritos** → `localStorage` para manter favoritos entre sessões  

---

## 📸 Layout

- Grid especial para destaques  
- Lista horizontal para demais notícias  
- Sidebar de categorias  
- Totalmente responsivo  
