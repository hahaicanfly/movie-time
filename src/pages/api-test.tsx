import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, Image, SimpleGrid, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export default function ApiTest() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      setError('請輸入搜尋關鍵字');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}`
      );
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
                  <Text color="gray.600">
                    上映日期: {movie.release_date}
                  </Text>
                </Box>
              </Link>
            </NextLink>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 