# 📰 News App

Um portal de notícias moderno feito em **React + TypeScript**, com busca, categorias, favoritos, destaques, scroll infinito e layout responsivo.

---

## 🚀 Instalação e Execução

1. **Clone o repositório**

   ```git clone https://github.com/seu-usuario/news-app.git```
   ```cd news-app```
   ```npm install```
   
2. **Instale as dependências**
   ```npm install```

3. Configure a chave da NewsAPI
   Crie um arquivo .env na raiz do projeto e adicione:
   ```VITE_API_KEY=sua_chave_aqui```

4. Execute o app
   ```npm run dev```
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
