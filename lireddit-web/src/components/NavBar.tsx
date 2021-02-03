import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import { RSA_PSS_SALTLEN_AUTO } from "constants";
import NextLink from "next/link";
import React from "react";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utilities/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <Flex w="100%" justify="space-between">
        <Flex align="center">
          <NextLink href="/">
            <Heading>LiReddit</Heading>
          </NextLink>
        </Flex>
        <Flex justify="space-evenly" align="center" w="50%">
          <NextLink href="/login">
            <Link ml="auto" mr={5}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link mr={5}>Register</Link>
          </NextLink>
        </Flex>
      </Flex>
    );
  } else {
    body = (
      <Flex w="100%" justify="space-between">
        <Flex align="center">
          <NextLink href="/">
            <Heading>LiReddit</Heading>
          </NextLink>
        </Flex>
        <Flex justify="space-evenly" align="center" w="50%">
          <Box ml="auto" mr="10">
            {data.me.username}
          </Box>
          <NextLink href="/create-post">
            <Button mr="10" variant="link">
              create post
            </Button>
          </NextLink>
          <Button
            onClick={() => {
              logout();
            }}
            variant="link"
          >
            logout
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p={4}>
      {body}
    </Flex>
  );
};
