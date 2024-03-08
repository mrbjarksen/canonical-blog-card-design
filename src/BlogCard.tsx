import { FC } from 'react';

export type BlogInfo = {
  title: string,
  author: {
    name: string,
    link: URL,
  }
  date: Date,
  link: URL,
  image: URL,
  category: string,
  topic: {
    name: string,
    slug: string,
  }
};

const BlogCard: FC<BlogInfo & { className: string }> = (props) => {
  return (
    <div className={`${props.className} blog-card blog-card--${props.topic.slug}`}>

      <header className="blog-card__header">
        <h5 className="p-muted-heading u-no-margin--bottom">
          {props.topic.name}
        </h5>
      </header>

      <div className="blog-card__content">
        <img className="p-card__image" src={props.image.toString()} alt="" />
        <h3 className="p-heading--4">
          <a href={props.link.toString()}>
            {props.title}
          </a>
        </h3>
        <p className="blog-card__content__footer">
          By <a href={props.author.link.toString()}>{props.author.name}</a> on {props.date.toLocaleDateString('en-GB', { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <p className="blog-card__footer">
        {props.category}
      </p>

    </div>
  );
};

export default BlogCard;
