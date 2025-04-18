import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Image, SimpleGrid, Spinner, VStack, HStack, Badge } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentMovies = async () => {
      try {
        // 獲取當前日期和兩個月前的日期
        const today = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        // 格式化日期為 YYYY-MM-DD
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=zh-TW&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${formatDate(twoMonthsAgo)}&primary_release_date.lte=${formatDate(today)}`
        );
        const data = await response.json();
        
        if (data.results.length === 0) {
          setError('目前沒有上映中的電影');
        } else {
          setMovies(data.results);
        }
      } catch (error) {
        setError('無法載入電影資訊');
        console.error('Error fetching recent movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMovies();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            最新上映電影
          </Heading>
          <Text color="gray.600">
            查看最近兩個月上映的熱門電影
          </Text>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" />
            <Text mt={4}>正在載入電影資訊...</Text>
          </Box>
        )}

        {error && (
          <Box textAlign="center" py={8}>
            <Text color="red.500">{error}</Text>
          </Box>
        )}

        <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4}>
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
    </Container>
  );
} 