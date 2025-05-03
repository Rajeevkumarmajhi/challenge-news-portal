import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import { fetchNewsApiArticles } from "@/services/newsApiService";
import { fetchGuardianArticles } from "@/services/guardianService";
import { fetchNYTimesArticles } from "@/services/nyTimesService";

import { Article } from "@/types/Article";

import DateFilter from "@/components/DateFilter";
import SourceFilter from "@/components/SourceFilter";
import AuthorFilter from "@/components/AuthorFilter";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ArticleCard from "@/components/ArticleCard";

const PAGE_SIZE = 20;

const Home = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [categories, setCategories] = useState<string[]>(["All"]);
	const [authors, setAuthors] = useState<string[]>([]);

	const [loading, setLoading] = useState(true);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [showFilters, setShowFilters] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSource, setSelectedSource] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [page, setPage] = useState(1);

	// Temporary state for filters while modal is open
	const [tempFromDate, setTempFromDate] = useState("");
	const [tempToDate, setTempToDate] = useState("");
	const [tempSource, setTempSource] = useState<string | null>(null);
	const [tempAuthor, setTempAuthor] = useState<string | null>(null);

	const loadArticles = async (
		append = false,
		pageNumber = 1,
		term = searchTerm,
		from = fromDate,
		to = toDate,
		category = selectedCategory,
		source = selectedSource,
		author = selectedAuthor
	) => {
		try {
			if (!append) {
				setLoading(true);
				setPage(1);
			} else {
				setIsFetchingMore(true);
			}

			const [newsApi, guardian, nyTimes] = await Promise.all([
				fetchNewsApiArticles(term, from, to, "", pageNumber, PAGE_SIZE),
				fetchGuardianArticles(term, from, to, "", pageNumber, PAGE_SIZE),
				fetchNYTimesArticles(term, from, to, pageNumber, PAGE_SIZE),
			]);

			let merged = [...newsApi, ...guardian, ...nyTimes];

			if (source) merged = merged.filter((a) => a.source === source);
			if (author) merged = merged.filter((a) => a.author === author);

			const sorted = merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

			const filtered = category && category !== "All" ? sorted.filter((a) => a.category === category) : sorted;

			const uniqueCategories = ["All", ...Array.from(new Set(merged.map((article) => article.category)))];
			setCategories(uniqueCategories.filter((c): c is string => c !== undefined && c !== ""));

			const uniqueAuthors = ["All", ...Array.from(
				new Set(sorted.map((a) => a.author).filter((a): a is string => typeof a === "string" && a.trim() !== ""))
			)];
			setAuthors(uniqueAuthors);

			setArticles((prev) => (append ? [...prev, ...filtered] : filtered));

			const nextPage = pageNumber + 1;
			const [nextNewsApi, nextGuardian, nextNyTimes] = await Promise.all([
				fetchNewsApiArticles(term, from, to, "", nextPage, PAGE_SIZE),
				fetchGuardianArticles(term, from, to, "", nextPage, PAGE_SIZE),
				fetchNYTimesArticles(term, from, to, nextPage, PAGE_SIZE),
			]);

			let nextMerged = [...nextNewsApi, ...nextGuardian, ...nextNyTimes];
			if (source) nextMerged = nextMerged.filter((a) => a.source === source);

			const nextFiltered = category && category !== "All" ? nextMerged.filter((a) => a.category === category) : nextMerged;

			setHasMore(nextFiltered.length > 0);
		} catch (err) {
			console.error("Failed to load articles:", err);
		} finally {
			setLoading(false);
			setIsFetchingMore(false);
		}
	};

	useEffect(() => {
		loadArticles(false, 1);
	}, [searchTerm, selectedCategory]);

	const handleSearch = (term: string) => setSearchTerm(term);
	const handleCategoryChange = (category: string) => setSelectedCategory(category === "All" ? "All" : category);

	const applyFilters = () => {
		setFromDate(tempFromDate);
		setToDate(tempToDate);
		setSelectedSource(tempSource);
		setSelectedAuthor(tempAuthor);
		setShowFilters(false);
		loadArticles(false, 1, searchTerm, tempFromDate, tempToDate, selectedCategory, tempSource, tempAuthor);
	};

	const cancelFilters = () => {
		setTempFromDate(fromDate);
		setTempToDate(toDate);
		setTempSource(selectedSource);
		setTempAuthor(selectedAuthor);
		setShowFilters(false);
	};

	const handleLoadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		loadArticles(true, nextPage);
	};

	const handleScroll = () => {
		const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
		if (bottom && hasMore && !isFetchingMore) {
			handleLoadMore();
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, isFetchingMore]);

	useEffect(() => {
		if (showFilters) {
			setTempFromDate(fromDate);
			setTempToDate(toDate);
			setTempSource(selectedSource);
			setTempAuthor(selectedAuthor);
		}
	}, [showFilters]);

	return (
		<div className="px-4 py-6 max-w-screen-2xl mx-auto overflow-x-hidden relative">
			<div className="grid grid-cols-1 gap-6">
				{/* Filter Panel */}
				<div className={`grid gap-4 transition-all duration-300 ${showFilters ? 'fixed top-2 left-4 right-4 bg-white p-4 z-50 shadow-lg rounded-md max-w-screen-2xl mx-auto' : 'hidden'}`}>
					{/* Date Filters */}
					<div>
						<DateFilter
							fromDate={tempFromDate}
							toDate={tempToDate}
							onFromChange={(date) => setTempFromDate(date)}
							onToChange={(date) => setTempToDate(date)}
						/>
					</div>

					{/* Source and Author */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
						<SourceFilter selectedSource={tempSource} onChange={setTempSource} />
						<AuthorFilter authors={authors} selectedAuthor={tempAuthor} onChange={setTempAuthor} />
					</div>

					<div className="hidden lg:grid lg:grid-cols-2 gap-4">
						<SourceFilter selectedSource={tempSource} onChange={setTempSource} />
						<AuthorFilter authors={authors} selectedAuthor={tempAuthor} onChange={setTempAuthor} />
					</div>

					{/* Buttons */}
					<div className="flex justify-end gap-3 pt-2">
						<button
							onClick={cancelFilters}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
						>
							Cancel
						</button>
						<button
							onClick={applyFilters}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
						>
							Apply Filters
						</button>
					</div>
				</div>

				{/* Search & Filter Toggle */}
				<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
					<div className="lg:col-span-4 md:col-span-2 col-span-1 flex justify-between items-center">
						<div className="flex-grow">
							<SearchBar onSearch={handleSearch} />
						</div>

						<button
							onClick={() => setShowFilters((prev) => !prev)}
							className="fixed bottom-6 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.447.832l-4 2.5A1 1 0 019 21.5V13.414L3.293 6.707A1 1 0 013 6V4z"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Category Filter */}
				<div className="overflow-x-auto">
					<CategoryFilter
						categories={categories}
						selectedCategory={selectedCategory}
						onChange={handleCategoryChange}
					/>
				</div>
			</div>

			{/* Loader */}
			{loading ? (
				<div className="flex justify-center items-center h-64 mt-6">
					<ClipLoader size={50} color="#4F46E5" />
				</div>
			) : (
				<div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
					{articles.length > 0 ? (
						articles.map((article) => <ArticleCard key={article.id} article={article} />)
					) : (
						<p className="col-span-full text-center text-gray-500">
							No articles found for "{searchTerm}"
						</p>
					)}
				</div>
			)}

			{/* Load More */}
			{isFetchingMore ? (
				<div className="flex justify-center items-center mt-6">
					<ClipLoader size={30} color="#4F46E5" />
				</div>
			) : hasMore && !loading ? (
				<div className="text-center mt-6">
					<button
						onClick={handleLoadMore}
						className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
					>
						Load More
					</button>
				</div>
			) : (
				<div className="text-center mt-6 text-gray-500">No more articles to load.</div>
			)}
		</div>
	);
};

export default Home;
