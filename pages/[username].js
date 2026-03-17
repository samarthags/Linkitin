import clientPromise from "../lib/mongodb";

export default function Profile({ user }) {
  if (!user) return <h1>User not found</h1>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>{user.name}</h1>
      <p>@{user.username}</p>
      <p>{user.bio}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const user = await db
    .collection("users")
    .findOne({ username: params.username });

  if (!user) {
    return { props: { user: null } };
  }

  return {
    props: {
      user: {
        username: user.username,
        name: user.name,
        bio: user.bio || "",
      },
    },
  };
}