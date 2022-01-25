import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from "axios";

import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "react-location";

function getActiveProps() {
  return {
    style: {
      fontWeight: "bold",
    },
  };
}
function PostsIndex() {
  return (
    <>
      <div>Select an post.</div>
    </>
  );
}
function Index() {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
}
function Post() {
  const {
    data: { post },
  } = useMatch();

  return (
    <div>
      <h4>{post?.title}</h4>
      <p>{post?.body}</p>
    </div>
  );
}

function Posts() {
  const {
    data: { posts },
  } = useMatch();

  return (
    <div>
      <div>
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Link to={post.id} getActiveProps={getActiveProps}>
                <pre>{post.title}</pre>
              </Link>
            </div>
          );
        })}
      </div>
      <hr />
      <Outlet />
    </div>
  );
}

function App() {
  async function fetchPosts() {
  await new Promise((r) => setTimeout(r, 300));
  return await axios
    .get("https://jsonplaceholder.typicode.com/posts")
    .then((r) => r.data.slice(0, 5));
  }
  
  async function fetchPostById(postId) {
  await new Promise((r) => setTimeout(r, 300));

  return await axios
    .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((r) => {
      console.log({r})
      return r.data
    })
    .catch((error)=>console.log({error}));
}

  const location = new ReactLocation();
  return (
     <Router
      location={location}
      routes={[
        { path: "/", element: <Index /> },
        {
          path: "posts",
          element: <Posts />,
          loader: async () => {
            return {
              posts: await fetchPosts(),
            };
          },
          children: [
            { path: "/", element: <PostsIndex /> },
            {
              path: ":postId",
              element: <Post />,
              loader: async ({ params: { postId } }) => {
                return {
                  post: await fetchPostById(postId),
                };
              },
            },
          ],
        },
      ]}
    >
      <div>
        <Link
          to="/"
          getActiveProps={getActiveProps}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link to="posts" getActiveProps={getActiveProps}>
          Posts
        </Link>
      </div>
      <hr />
      <Outlet /> {/* Start rendering router matches */}
    </Router>
  );
}
 
export default App;
