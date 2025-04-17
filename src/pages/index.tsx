import { useEffect, useState } from 'react';
import { Box, Heading, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { MovieList } from '../components/MovieList';
import { tmdbService, Movie } from '../api/tmdb';

export default function Home() {
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [nowPlayingData, upcomingData] = await Promise.all([
                    tmdbService.getNowPlaying(),
                    tmdbService.getUpcoming()
                ]);
                
                setNowPlaying(nowPlayingData.results);
                setUpcoming(upcomingData.results);
            } catch (error) {
                console.error('獲取電影數據時出錯:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <Box p={4}>載入中...</Box>;
    }

    return (
        <Box maxW="1200px" mx="auto" py={8}>
            <Heading as="h1" mb={6} textAlign="center">
                電影時刻
            </Heading>

            <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                    <Tab>現正熱映</Tab>
                    <Tab>即將上映</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <MovieList movies={nowPlaying} />
                    </TabPanel>
                    <TabPanel>
                        <MovieList movies={upcoming} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
} 