import React from 'react';
import { Box, SimpleGrid, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Movie } from '../api/tmdb';

interface MovieListProps {
    movies: Movie[];
}

export const MovieList: React.FC<MovieListProps> = ({ movies }) => {
    const router = useRouter();

    const handleMovieClick = (movieId: number) => {
        router.push(`/movies/${movieId}`);
    };

    return (
        <SimpleGrid columns={[2, 3, 4, 5]} spacing={6} p={4}>
            {movies.map((movie) => (
                <Box 
                    key={movie.id} 
                    borderRadius="lg" 
                    overflow="hidden" 
                    shadow="md"
                    cursor="pointer"
                    transition="transform 0.2s"
                    _hover={{
                        transform: 'scale(1.05)',
                        shadow: 'lg'
                    }}
                    onClick={() => handleMovieClick(movie.id)}
                >
                    <VStack>
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            fallbackSrc="https://via.placeholder.com/500x750"
                        />
                        <Box p={4}>
                            <Text fontWeight="bold" noOfLines={2}>
                                {movie.title}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(movie.release_date).toLocaleDateString('zh-TW')}
                            </Text>
                            <Text fontSize="sm" color="yellow.500">
                                ★ {movie.vote_average.toFixed(1)}
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            ))}
        </SimpleGrid>
    );
}; 