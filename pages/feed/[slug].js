import styles from "../../styles/feed.module.css";
import { useRouter } from "next/router";
import { Toolbar } from "../../components/toolbar";

const Feed = ({ pageNumber, articles }) => {
  const Router = useRouter();

  console.log(articles, pageNumber);

  const articleArray = articles.map((article, index) => {
    return (
      <div
        key={index}
        className={styles.post}
        onClick={() => (window.location.href = article.url)}
      >
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        {article.urlToImage && <img src={article.urlToImage} />}
      </div>
    );
  });

  return (
    <div className="page-container">
      <Toolbar />
      <div className={styles.main}>
        <div>{articleArray}</div>
      </div>
      <div className={styles.paginator}>
        <div
          className={pageNumber === 1 ? styles.disabled : styles.active}
          onClick={() => {
            if (pageNumber > 1) {
              Router.push(`/feed/${pageNumber - 1}`).then(() => {
                window.scrollTo(0, 0);
              });
            }
          }}
        >
          Previous Page
        </div>
        <div>Page {pageNumber}</div>
        <div
          className={pageNumber === 5 ? styles.disabled : styles.active}
          onClick={() => {
            if (pageNumber < 5) {
              Router.push(`/feed/${pageNumber + 1}`).then(() => {
                window.scrollTo(0, 0);
              });
            }
          }}
        >
          Next Page
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageNumber = pageContext.query.slug;

  if (!pageNumber || pageNumber < 1 || pageNumber > 5) {
    return {
      props: {
        articles: [],
        pageNumber: 1,
      },
    };
  }

  const apiResponse = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&page=${pageNumber}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  );

  const apiJson = await apiResponse.json();

  const { articles } = apiJson;

  return {
    props: {
      articles: articles,
      pageNumber: Number.parseInt(pageNumber),
    },
  };
};

export default Feed;
