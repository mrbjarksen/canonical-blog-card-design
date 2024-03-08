import React, { useEffect, useState } from 'react';
import BlogCard, { BlogInfo } from './BlogCard';

type BlogSchema = {
  title: { rendered: string },
  author: number,
  date: string,
  link: string,
  featured_media: string,
  categories: number[],
  tags: number[],
  topic: number[],
  group: number[],
  _embedded: {
    author: { id: number, name: string, link: string }[],
    "wp:term": { id: number, name: string, slug: string }[][],
  }
};

function parseBlog(blog: BlogSchema): BlogInfo {
  const author = blog._embedded.author
    .find(({ id }) => id === blog.author)
    || { name: "<unknown>", link: "" };

  const category = blog._embedded["wp:term"].flat()
    .find(({ id }) => id === blog.categories[0])
    || { name: "" };
  
  const topic = blog._embedded["wp:term"].flat()
    .find(({ id }) => id === (blog.topic[0] || blog.group[0] || blog.tags[0]))
    || { name: "", slug: "" };

  return {
    title: blog.title.rendered,
    author: {
      name: author.name,
      link: new URL(author.link),
    },
    date: new Date(blog.date),
    link: new URL(blog.link),
    image: new URL(blog.featured_media),
    category: category.name === "Articles" ? "Article" : category.name,
    topic: {
      name: topic.name,
      slug: topic.slug,
    }
  }
}

async function getBlogs(url: URL): Promise<BlogInfo[]> {
  const response = await fetch(url);
  if (!response.ok) return [];
  let data = await response.json();
  if (!Array.isArray(data)) data = [data];
  return data.map(parseBlog);
}

function App() {
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);

  useEffect(() => {
    getBlogs(new URL("https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json"))
      .then(setBlogs);
  }, []);

  if (blogs && blogs.length > 0) {
    return (
      <section className="p-strip">
        <div className="row u-equal-height u-clearfix">
          {blogs.map((blogInfo: BlogInfo) =>
            <BlogCard key={blogInfo.title} className="col-4 col-medium-2" {...blogInfo} />
          )}
        </div>
      </section>
    );
  }
  else {
    return <div>Loading...</div>
  }
}

export default App;
