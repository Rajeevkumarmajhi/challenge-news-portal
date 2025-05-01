import { useEffect, useState } from "react";
import { fetchNewsApiArticles } from "@/services/newsApiService";
import { fetchGuardianArticles } from "@/services/guardianService";
import { fetchNYTimesArticles } from "@/services/nyTimesService";
import { Article } from "@/types/Article";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import DateFilter from '@/components/DateFilter';

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');


  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const [newsApi, guardian, nyTimes] = await Promise.all([
          fetchNewsApiArticles(""),
          fetchGuardianArticles(""),
          fetchNYTimesArticles(""),
        ]);
        const mergedArticles = [...newsApi, ...guardian, ...nyTimes];
        const sortedArticles = mergedArticles.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);

        const uniqueCategories = Array.from(
          new Set(
            sortedArticles
              .map((a) => a.category)
              .filter((cat): cat is string => typeof cat === 'string' && cat.trim() !== '')
          )
        );
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
  };

  const applyFilters = (term: string, category: string, from?: string, to?: string) => {
    let filtered = [...articles];

    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerTerm) ||
          article.description.toLowerCase().includes(lowerTerm)
      );
    }

    if (category) {
      filtered = filtered.filter((article) => article.category === category);
    }

    if (from) {
      const fromTime = new Date(from).getTime();
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt).getTime() >= fromTime
      );
    }
    if (to) {
      const toTime = new Date(to).getTime();
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt).getTime() <= toTime
      );
    }

    setFilteredArticles(filtered);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />
      <DateFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromChange={(date) => {
          setFromDate(date);
          applyFilters(searchTerm, selectedCategory, date, toDate);
        }}
        onToChange={(date) => {
          setToDate(date);
          applyFilters(searchTerm, selectedCategory, fromDate, date);
        }}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChange={handleCategoryChange}
      />
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No articles found for "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
