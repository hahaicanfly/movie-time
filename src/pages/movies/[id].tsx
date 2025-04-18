import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Container,
    Heading,
    Image,
    Text,
    VStack,
    HStack,
    Badge,
    Spinner,
    Grid,
    GridItem,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Divider,
} from '@chakra-ui/react';

interface MovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    genres: { id: number; name: string }[];
    runtime: number;
    status: string;
}

export default function MovieDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!id) return;

            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                );
                const data = await response.json();
                setMovie(data);
            } catch (error) {
                setError('無法載入電影詳細資訊');
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return (
            <Box textAlign="center" py={20}>
                <Spinner size="xl" />
                <Text mt={4}>正在載入電影資訊...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>錯誤</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!movie) {
        return (
            <Alert status="warning">
                <AlertIcon />
                <AlertTitle>找不到電影</AlertTitle>
                <AlertDescription>請確認電影 ID 是否正確</AlertDescription>
            </Alert>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={8}>
                <GridItem>
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        borderRadius="lg"
                        fallbackSrc="https://via.placeholder.com/500x750"
                    />
                </GridItem>
                <GridItem>
                    <VStack align="start" spacing={4}>
                        <Heading as="h1" size="2xl">
                            {movie.title}
                        </Heading>
                        
                        <HStack spacing={2}>
                            <Badge colorScheme="green" fontSize="md">
                                {movie.vote_average.toFixed(1)} 分
                            </Badge>
                            <Badge colorScheme="blue" fontSize="md">
                                {movie.release_date}
                            </Badge>
                            <Badge colorScheme="purple" fontSize="md">
                                {movie.runtime} 分鐘
                            </Badge>
                        </HStack>

                        <HStack spacing={2}>
                            {movie.genres.map((genre) => (
                                <Badge key={genre.id} colorScheme="teal">
                                    {genre.name}
                                </Badge>
                            ))}
                        </HStack>

                        <Divider />

                        <Box>
                            <Heading as="h2" size="md" mb={2}>
                                劇情簡介
                            </Heading>
                            <Text>{movie.overview || '暫無劇情簡介'}</Text>
                        </Box>

                        <Box>
                            <Heading as="h2" size="md" mb={2}>
                                狀態
                            </Heading>
                            <Text>{movie.status}</Text>
                        </Box>
                    </VStack>
                </GridItem>
            </Grid>
        </Container>
    );
} 