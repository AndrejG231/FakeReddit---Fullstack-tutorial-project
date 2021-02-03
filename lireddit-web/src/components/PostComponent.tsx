import { ChevronUpIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import {
  Post,
  PostSnippetFragment,
  useDeletePostMutation,
  useVotedQuery,
  useVoteMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utilities/createUrqlCLient";
import NextLink from "next/link";
import { VotesComponent } from "./VotesComponent";

interface PostComponentProps {
  post: PostSnippetFragment | Post;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const [, deletePost] = useDeletePostMutation();

  const [isDeleted, setIsDeleted] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(
    ""
  );
  if(isDeleted){
    return null
  }

  return (
    <Flex position="relative" p={5} shadow="md" borderWidth="1px">
      <VotesComponent post={post}/>
            <Box>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text size="6">by {post.creator.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
      <Flex
        direction="column"
        bottom="10px"
        right="10px"
        position="absolute"
        align="flex-end"
      >
        <Text color="red.500">{deleteErrorMessage}</Text>
        <Flex
          justify="center"
          borderRadius="25%"
          align="center"
          w="6"
          h="6"
          background="lightblue"
          cursor="pointer"
        >
          <DeleteIcon onClick={async () => {
            if (deleteErrorMessage === ""){
              const deleted = await deletePost({ id : post.id});
              if (deleted.data?.deletePost !== 1){
                setDeleteErrorMessage("U have no rights to delete this post!");
                setTimeout(() => setDeleteErrorMessage(""), 3000)
              } else {
                setIsDeleted(true)
              }
            }
          }}/>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(PostComponent);
