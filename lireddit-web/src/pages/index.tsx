import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utilities/createUrqlCLient";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    }
  });
  return (
    <div>
      <NavBar />
      {!data ? <div>Loading...</div>: data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
