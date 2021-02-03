import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { createUrqlClient } from "../../../utilities/createUrqlCLient";
import {
  Post,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { Box, Flex, Link, Textarea, Text, Button } from "@chakra-ui/react";
import { Layout } from "../../../components/Layout";
import VotesComponent from "../../../components/VotesComponent";

interface pageProps {}

export const EditPage = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching }] = usePostQuery({
    pause: intId < 0,
    variables: { id: intId },
  });

  const [, updatePost] = useUpdatePostMutation();

  //NO DATA:

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  console.log(data?.post);

  if (typeof data?.post === undefined) {
    if (data?.post?.id < 0 && typeof data?.post?.id !== "number") {
      return (
        <Layout>
          <div>Post deleted or invalid.</div>
        </Layout>
      );
    }
  }
  // WE HAVE DATA:

  const [title, setTitle] = useState(data.post.title);
  const [text, setText] = useState(data.post.text);
  const [errors, setErrors] = useState("");

  const raiseError = (message: string) => {
    if (errors === "") {
      setErrors(message);
      setTimeout(() => setErrors(""), 1500);
      console.log("errors cleared");
    }
  };

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
              <Textarea
                background="white"
                m={2}
                fontSize={40}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
          <Textarea
            background="white"
            m={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Flex>
        <Text ml="auto" mr={5} color="red.500">
          {errors}
        </Text>
        <Flex>
          <Button
            m={5}
            ml="auto"
            colorScheme="teal"
            onClick={() => {
              router.push(`/post/${data?.post?.id}`);
            }}
          >
            Discard
          </Button>
          <Button
            m={5}
            colorScheme="teal"
            onClick={async () => {
              if (text !== "" && title !== "") {
                const result = await updatePost({
                  id: data.post.id,
                  title: title,
                  text: text,
                });
                if (result?.data?.updatePost === null) {
                  setErrors("Some error occured");
                } else {
                  data.post = result.data?.updatePost;
                  router.push(`/post/${data?.post?.id}`);
                }
              } else {
                setErrors("No fields can remain empty!");
              }
            }}
          >
            Save Edit
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPage);
