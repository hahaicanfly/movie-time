import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { tmdbService } from '../../api/tmdb';

interface MovieDetail extends Movie {
    genres: { id: number; name: string }[];
    runtime: number;
    overview: string;
    backdrop_path: string;
}

export default function MovieDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMovieDetail() {
            if (!id) return;
            
            try {
                setLoading(true);
                const data = await tmdbService.getMovieDetails(Number(id));
                setMovie(data);
            } catch (err) {
                setError('無法載入電影詳情');
                console.error('獲取電影詳情時出錯:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchMovieDetail();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error || !movie) {
        return (
            <Box p={4} textAlign="center">
                <Text color="red.500">{error || '找不到電影資訊'}</Text>
            </Box>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box
                position="relative"
                height="400px"
                mb={8}
                borderRadius="lg"
                overflow="hidden"
            >
                <Image
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    fallbackSrc="https://via.placeholder.com/1920x1080"
                />
            </Box>

            <HStack spacing={8} align="flex-start">
                <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    borderRadius="lg"
                    width="300px"
                    fallbackSrc="https://via.placeholder.com/500x750"
                />

                <VStack align="flex-start" spacing={4}>
                    <Heading as="h1" size="2xl">
                        {movie.title}
                    </Heading>

                    <HStack wrap="wrap" spacing={2}>
                        {movie.genres.map((genre) => (
                            <Badge key={genre.id} colorScheme="teal">
                                {genre.name}
                            </Badge>
                        ))}
                    </HStack>

                    <Text fontSize="lg" color="yellow.500">
                        ★ {movie.vote_average.toFixed(1)}
                    </Text>

                    <Text color="gray.500">
                        上映日期：{new Date(movie.release_date).toLocaleDateString('zh-TW')}
                    </Text>

                    <Text color="gray.500">
                        片長：{Math.floor(movie.runtime / 60)}小時{movie.runtime % 60}分鐘
                    </Text>

                    <Box>
                        <Text fontSize="xl" fontWeight="bold" mb={2}>
                            劇情簡介
                        </Text>
                        <Text fontSize="lg" lineHeight="tall">
                            {movie.overview || '暫無簡介'}
                        </Text>
                    </Box>
                </VStack>
            </HStack>
        </Container>
    );
} 