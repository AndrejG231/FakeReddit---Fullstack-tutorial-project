import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { createUrqlClient } from "../../utilities/createUrqlCLient";
import { usePostQuery } from "../../generated/graphql";
import { Link } from "@chakra-ui/react";
import { Layout } from "../../components/Layout";

interface pageProps {}

export const Post = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId < 0,
    variables: { id: intId },
  });
  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }
  return(
    <Layout>
      {data?.post?.id}
    </Layout>
  )
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
