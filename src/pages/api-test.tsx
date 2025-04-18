import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, Image, SimpleGrid } from '@chakra-ui/react';

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

  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
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
        />
        <Button
          colorScheme="blue"
          onClick={searchMovies}
          isLoading={loading}
        >
          搜尋電影
        </Button>

        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} w="100%">
          {movies.map((movie) => (
            <Box
              key={movie.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fallbackSrc="https://via.placeholder.com/500x750"
              />
              <Text mt={2} fontWeight="bold">
                {movie.title}
              </Text>
              <Text color="gray.600">
                上映日期: {movie.release_date}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 