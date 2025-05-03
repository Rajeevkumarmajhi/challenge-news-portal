import { useEffect, useState } from "react";
import { fetchNewsApiArticles } from "@/services/newsApiService";
import { fetchGuardianArticles } from "@/services/guardianService";
import { fetchNYTimesArticles } from "@/services/nyTimesService";

import { Article } from "@/types/Article";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import DateFilter from "@/components/DateFilter";
import SourceFilter from "@/components/SourceFilter";
import { ClipLoader } from "react-spinners";

const PAGE_SIZE = 20;

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const loadArticles = async (
    append = false,
    pageNumber = 1,
    term = searchTerm,
    from = fromDate,
    to = toDate,
    category = selectedCategory,
    source = selectedSource
  ) => {
    try {
      if (!append) {
        setLoading(true);
        setPage(1); // Reset page when loading new results
      } else {
        setIsFetchingMore(true); // Show loader for more articles
      }

      // Fetch articles from different sources
      const [newsApi, guardian, nyTimes] = await Promise.all([
        fetchNewsApiArticles(term, from, to, "", pageNumber, PAGE_SIZE),
        fetchGuardianArticles(term, from, to, "", pageNumber, PAGE_SIZE),
        fetchNYTimesArticles(term, from, to, pageNumber, PAGE_SIZE),
      ]);

      // Merge all the articles
      let merged = [...newsApi, ...guardian, ...nyTimes];

      // Apply source filtering if needed
      if (source) {
        merged = merged.filter((a) => a.source === source);
      }

      // Sort articles by published date
      const sorted = merged.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Filter by category if any
      const filtered = category && category !== "All"
        ? sorted.filter((a) => a.category === category)
        : sorted;

      // Extract unique categories from the fetched articles
      const uniqueCategories = ["All", ...Array.from(new Set(merged.map((article) => article.category)))];
      setCategories(uniqueCategories.filter((category): category is string => category !== undefined && category !== ""));

      // If not appending, reset articles to new ones
      setArticles((prev) => (append ? [...prev, ...filtered] : filtered));

      // Check if there are more articles to load
      setHasMore(filtered.length === PAGE_SIZE); // Only show "Load More" if we get a full page
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadArticles(false, 1); // Load articles when any filter or search term changes
  }, [searchTerm, selectedSource, selectedCategory, fromDate, toDate, page]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "All" ? "All" : category);
  };

  const handleDateChange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1; // Increment the page value manually
    setPage(nextPage); // Update state to reflect the next page
    loadArticles(true, nextPage); // Load next page
  };

  // Auto load more when scrolling to the bottom
  const handleScroll = () => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if (bottom && hasMore && !isFetchingMore) {
      handleLoadMore(); // Automatically load more if at the bottom
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isFetchingMore]);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 mt-4">

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-none">
            <DateFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromChange={(date) => handleDateChange(date, toDate)}
              onToChange={(date) => handleDateChange(fromDate, date)}
            />
            <SourceFilter
              selectedSource={selectedSource}
              onChange={handleSourceChange}
            />
          </div>

          {/* SearchBar */}
          <div className="flex-grow">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>


        {/* Category Filter: always in a separate row */}
        <div className="overflow-x-auto">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
      </div>


      {loading && (
        <div className="flex justify-center items-center h-64 mt-6">
          <ClipLoader size={50} color="#4F46E5" />
        </div>
      )}

      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No articles found for "{searchTerm}"
          </p>
        )}
      </div>

      {/* "Load More" Button */}
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {isFetchingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
