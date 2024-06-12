import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  Text,
  Link,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Box,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState("");
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("black", "white");

  useEffect(() => {
    const fetchStories = async () => {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/newstories.json"
      );
      const storyIds = await response.json();
      const storiesPromises = storyIds.slice(0, 10).map(async (id) => {
        const storyResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return storyResponse.json();
      });
      const stories = await Promise.all(storiesPromises);
      setStories(stories);
    };

    fetchStories();
  }, []);

  const filteredStories = stories.filter(
    (story) =>
      !story.title.toLowerCase().includes("security") &&
      !story.title.toLowerCase().includes("ai")
  );

  return (
    <Container
      centerContent
      maxW="container.md"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={bgColor}
      color={textColor}
    >
      <VStack spacing={4} width="100%">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Dark Mode
          </FormLabel>
          <Switch id="dark-mode" onChange={toggleColorMode} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="filter">Filter Keywords</FormLabel>
          <Input
            id="filter"
            placeholder="Enter keywords to filter out"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </FormControl>
        {filteredStories.map((story) => (
          <Box
            key={story.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            width="100%"
            bg={useColorModeValue("white", "gray.700")}
          >
            <Text fontSize="xl" fontWeight="bold">
              {story.title}
            </Text>
            <Link href={story.url} color="teal.500" isExternal>
              Read more
            </Link>
            <Text mt={2} display="flex" alignItems="center">
              <FaArrowUp style={{ marginRight: "8px" }} />
              {story.score} upvotes
            </Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;