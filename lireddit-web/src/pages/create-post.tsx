import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utilities/createUrqlCLient";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql"

export const CreatePost: React.FC<{}> = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data, router]);
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Title" name="title" placeholder="title" />
            <InputField
              label="Body"
              name="text"
              placeholder="Text..."
              textarea
            />
            <Button
              type="submit"
              colorScheme="teal"
              mr={4}
              isLoading={isSubmitting}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
