import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface PostComponentProps {
  post: PostSnippetFragment;
}

export const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  const [points, setPoints] = useState(post.points);
  return (
    <Flex p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" align="center" mr="5">
        <ChevronUpIcon
          cursor="pointer"
          onClick={async () => {
            let value = await vote({ value: 1, postId: post.id });
            if (typeof value.data?.vote === "number") {
              setPoints(points + value.data.vote);
            }
          }}
        />
        {points}
        <ChevronDownIcon
          cursor="pointer"
          onClick={async () => {
            let value = await vote({ value: -1, postId: post.id });
            if (typeof value.data?.vote === "number") {
              setPoints(points + value.data.vote);
            }
          }}
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text size="6">by {post.creator.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
    </Flex>
  );
};
