import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, Text, Image, SimpleGrid, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Link, Select, HStack, Flex, Badge } from '@chakra-ui/react';
import NextLink from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

export default function ApiTest() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=zh-TW`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      setError('請輸入搜尋關鍵字');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}&language=zh-TW`;
      
      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }
      if (selectedYear) {
        url += `&year=${selectedYear}`;
      }
      if (selectedRating) {
        url += `&vote_average.gte=${selectedRating}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results.length === 0) {
        setError('沒有找到相關電影');
        setMovies([]);
      } else {
        setMovies(data.results);
      }
    } catch (error) {
      setError('搜尋過程中發生錯誤，請稍後再試');
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <Box p={8}>
      <VStack spacing={4}>
        <Input
          placeholder="輸入電影名稱"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="lg"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchMovies();
            }
          }}
        />

        <Flex gap={4} wrap="wrap" w="100%">
          <Select
            placeholder="選擇類型"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            flex="1"
            minW="200px"
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="選擇年份"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            flex="1"
            minW="200px"
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>

          <Select
            placeholder="最低評分"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            flex="1"
            minW="200px"
          >
            <option value="8">8分以上</option>
            <option value="7">7分以上</option>
            <option value="6">6分以上</option>
            <option value="5">5分以上</option>
          </Select>
        </Flex>

        <Button
          colorScheme="blue"
          onClick={searchMovies}
          isLoading={loading}
          loadingText="搜尋中..."
        >
          搜尋電影
        </Button>

        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>錯誤</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" />
            <Text mt={4}>正在搜尋電影...</Text>
          </Box>
        )}

        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} w="100%">
          {movies.map((movie) => (
            <NextLink href={`/movies/${movie.id}`} key={movie.id} passHref>
              <Link _hover={{ textDecoration: 'none' }}>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  p={4}
                  cursor="pointer"
                  _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fallbackSrc="https://via.placeholder.com/500x750"
                    borderRadius="md"
                  />
                  <Text mt={2} fontWeight="bold">
                    {movie.title}
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Badge colorScheme="green">
                      {movie.vote_average.toFixed(1)} 分
                    </Badge>
                    <Text color="gray.600">
                      {movie.release_date}
                    </Text>
                  </HStack>
                </Box>
              </Link>
            </NextLink>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 