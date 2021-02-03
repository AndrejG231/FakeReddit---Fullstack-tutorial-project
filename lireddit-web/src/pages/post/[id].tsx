import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { createUrqlClient } from "../../utilities/createUrqlCLient";
import {
  Post,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../../generated/graphql";
import { Box, Flex, Link, Textarea, Text, Button } from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import VotesComponent from "../../components/VotesComponent";
import { error } from "console";

interface pageProps {}

export const PostPage = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching }] = usePostQuery({
    pause: intId < 0,
    variables: { id: intId },
  });
  const [meData = { data }] = useMeQuery();

  const [errors, setErrors] = useState<string>("");
  //NO DATA:

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (data?.post) {
    if (data?.post?.id < 0) {
      return (
        <Layout>
          <div>Post deleted or invalid.</div>
        </Layout>
      );
    }
  }
  // WE HAVE DATA:

  return (
    <Layout>
      <Flex
        direction="column"
        shadow="md"
        background="gray.50"
        minHeight="200px"
      >
        <Flex
          mt={5}
          direction="row"
          width="100%"
          justify="space-between"
          align="center"
          height="150"
        >
          <Flex direction="column" ml={5} mr={5} mt={15}>
            <Text mr="auto" fontSize={30} decoration="underline">
              <Text m={2} fontSize={40}>
                {data?.post.title}
              </Text>
            </Text>
            <Text mr="auto" ml={2} fontSize={25}>
              by {data.post.creator.username}
            </Text>
          </Flex>
          <VotesComponent post={data.post as Post} />
        </Flex>
        <Flex
          direction="row"
          width="100%"
          justify="space-between"
          align="center"
        >
          <Box ml={5} mr={5} mt={15} background="white" shadow="md" w="100%">
            <Text m={2}>{data?.post?.text}</Text>
          </Box>
        </Flex>
        <Text ml="auto" mr={5}>{errors}</Text>
        <Flex>
          <Button
            m={5}
            ml="auto"
            colorScheme="teal"
            onClick={() => {
              if (data.post.creator.id === meData.data.me.id) {
                router.push(`/post/edit/${data?.post?.id}`);
              }else{
                if (errors===""){
                setErrors("You have no permission to do this.")
                setTimeout(() => setErrors(""), 1500)
              }
              }
            }}
          >
            Edit post
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(PostPage);
