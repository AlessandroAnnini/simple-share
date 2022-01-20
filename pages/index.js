import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { Select, ButtonRotate } from '@/components';
import { supabase } from '@/utils/supabaseClient';
import { tags } from '@/utils/tags';

const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;

const myTags = [{ value: '', label: 'all' }, ...tags];

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = tag
        ? await supabase
            .from('posts')
            .select()
            .eq('tag', tag)
            .order('inserted_at', { ascending: false })
        : await supabase
            .from('posts')
            .select()
            .order('inserted_at', { ascending: false });

      setPosts(data);
      setLoading(false);
    }

    fetchPosts();
  }, [tag]);

  if (loading) return <p className="text-2xl">Loading ...</p>;

  return (
    <div>
      <Head>
        <title>{websiteName}</title>
      </Head>

      <div className="flex justify-between align-center">
        <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
          Posts
        </h1>

        {user && (
          <>
            <Link href="/my-posts" passHref>
              <ButtonRotate tooltip="my posts">
                <FontAwesomeIcon icon={faListUl} />
              </ButtonRotate>
            </Link>
            <ReactTooltip />
          </>
        )}
      </div>

      <Select
        className="max-w-sm py-6"
        name="select a tag"
        options={myTags}
        selected={tag}
        setSelected={(e) => setTag(e.target.value)}
      />

      {posts.length ? (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.type === 'content' ? 'posts' : 'bookmarks'}/${
              post.id
            }`}>
            <a className="block border-b border-gray-300	mt-8 pb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 mt-2">
                Tag: {post.tag} - Author: {post.author_name}
              </p>
            </a>
          </Link>
        ))
      ) : (
        <p className="text-2xl">No posts.</p>
      )}
    </div>
  );
}
