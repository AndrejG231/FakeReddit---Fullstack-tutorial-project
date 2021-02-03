import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react'
import { PostSnippetFragment, useVotedQuery, useVoteMutation } from '../generated/graphql';
import { createUrqlClient } from '../utilities/createUrqlCLient';

interface VotesComponent{
  post: PostSnippetFragment
}

export const VotesComponent :React.FC<VotesComponent> = ({post}) => {
  const [, vote] = useVoteMutation();
  const [{ data }] = useVotedQuery({ variables: { postId: post.id } });

  const [myVote, setMyVote] = useState(0 as number | undefined);
  const [points, setPoints] = useState(post.points);

  useEffect(() => {
    setMyVote(data?.voted);
  }, [data]);


  return (
    <Flex direction="column" align="center" mr="5">
        <ChevronUpIcon
          color={myVote === 1 ? "green.500" : ""}
          cursor="pointer"
          onClick={async () => {
            let value = await vote({ value: 1, postId: post.id });
            if (typeof value.data?.vote === "number") {
              setPoints(points + value.data.vote);
              setMyVote(1);
            }
          }}
        />
        {points}
        <ChevronDownIcon
          color={myVote === -1 ? "red.500" : ""}
          cursor="pointer"
          onClick={async () => {
            let value = await vote({ value: -1, postId: post.id });
            if (typeof value.data?.vote === "number") {
              setPoints(points + value.data.vote);
              setMyVote(-1);
            }
          }}
        />
      </Flex>
  )
}


export default withUrqlClient(createUrqlClient)(VotesComponent);